import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js'; 
import Item from './models/item.model.js';
import Order from './models/order.model.js';
import { connectDB } from './config/db.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
connectDB();
const JWT_SECRET = process.env.JWT_SECRET;
app.use(cors());

app.post('/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, age, contactNumber, password } = req.body;
  
      if (!firstName || !lastName || !email || !age || !contactNumber || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = new User({
        firstName,
        lastName,
        email,
        age,
        contactNumber,
        password: password.trim(),
      });
  
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during signup:', error.message); // Log the error
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d' // Token expiration time, e.g., 7 days
    });

    // Send the token to the client
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied, token missing!' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
};

app.post('/updateUser',authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, age, contactNumber } = req.body;
    const userId=req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find user by ID and update the fields if they are provided
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(age && { age }),
        ...(contactNumber && { contactNumber }),
      },
      { new: true, runValidators: true } // options to return the updated document and run validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

  app.get('/user',authenticateToken, async (req, res) => {
    try {
      const userId=req.user.userId
  
      // Validate the userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Respond with user details
      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        contactNumber: user.contactNumber
      });
    } catch (error) {
      console.error('Error retrieving user details:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/sell',authenticateToken, async (req, res) => {
    try {
      const { name, price, description, category } = req.body;
      const userId=req.user.userId;
  
      if (!userId || !name || !price || !description || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Validate seller exists
      const seller = await User.findById(userId);
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      // Create a new item
      const newItem = new Item({
        name,
        price,
        description,
        category,
        sellerId: userId,
        isSold: false,
      });
  
      // Save the new item to the database
      await newItem.save();
  
      res.status(201).json({
        message: 'Item listed for sale successfully',
        item: newItem,
      });
    } catch (error) {
      console.error('Error listing item for sale:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/search',authenticateToken, async (req, res) => {
    try {
      const { name, category } = req.query;
      const userId=req.user.userId;
  
      // Build the query object
      const query = { isSold: false };
  
      // If a name is provided, add a case-insensitive regex search to the query
      if (name) {
        query.name = new RegExp(name, 'i'); // 'i' makes it case-insensitive
      }
  
      // If categories are provided, split them by comma and filter by these categories
      if (category) {
        const categories = category.split(','); // Assuming categories are comma-separated
        query.category = { $in: categories };
      }
  
      // Exclude items listed by the user with the given userId
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid userId format' });
        }
        query.sellerId = { $ne: new mongoose.Types.ObjectId(userId) }; // Correct usage with 'new'
      }
  
      // Find items based on the query
      const items = await Item.find(query).populate('sellerId', 'firstName lastName email');
  
      // Check if no items are found
      if (items.length === 0) {
        return res.status(200).json({
          message: 'No items found matching the criteria',
          items: []
        });
      }
  
      // Respond with the found items including itemId
      res.status(200).json({
        message: 'Items retrieved successfully',
        items: items.map(item => ({
          itemId: item._id, // Include itemId in the response
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          seller: {
            name: `${item.sellerId.firstName} ${item.sellerId.lastName}`,
            email: item.sellerId.email
          }
        }))
      });
    } catch (error) {
      console.error('Error retrieving items:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/items',authenticateToken, async (req, res) => {
    try {
      const { itemId } = req.query; // Retrieve itemId from query parameters
  
      // Validate the itemId
      if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
  
      // Find the item by ID
      const item = await Item.findById(itemId).populate('sellerId', 'firstName lastName email');
  
      // Check if item exists
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Respond with item details
      res.status(200).json({
        itemId: item._id,
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        seller: {
          name: `${item.sellerId.firstName} ${item.sellerId.lastName}`,
          email: item.sellerId.email
        }
      });
    } catch (error) {
      console.error('Error retrieving item details:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/cart',authenticateToken, async (req, res) => {
    try {
      const { itemId, action } = req.body; // Get userId, itemId, and action from request body
      const userId=req.user.userId;
  
      // Validate input
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      if (!['add', 'remove'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
      }
  
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the item and check if it belongs to the user
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Ensure the seller cannot add their own item to their cart
      if (item.sellerId.toString() === userId) {
        return res.status(403).json({ message: 'Sellers cannot add their own items to their cart' });
      }
  
      // Add or remove item based on action
      if (action === 'add') {
        if (!user.cartItems.includes(itemId)) {
          user.cartItems.push(itemId);
        } else {
          return res.status(200).json({ message: 'Item is already in the cart', cartItems: user.cartItems });
        }
      } else if (action === 'remove') {
        if (user.cartItems.includes(itemId)) {
          user.cartItems = user.cartItems.filter(id => id.toString() !== itemId);
        } else {
          return res.status(200).json({ message: 'Item was not in the cart', cartItems: user.cartItems });
        }
      }
  
      // Save user with updated cart items
      await user.save();
  
      // Respond with updated cart items
      const populatedUser = await User.findById(userId).populate('cartItems');
      res.status(200).json({
        message: `Item successfully ${action === 'add' ? 'added to' : 'removed from'} cart`,
        cartItems: populatedUser.cartItems
      });
    } catch (error) {
      console.error('Error updating cart:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/mycart',authenticateToken, async (req, res) => {
    try {
      const userId=req.user.userId;
  
      // Validate the userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        console.log('Invalid user ID format or missing.');
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Find the user and populate cart items
      const user = await User.findById(userId).populate('cartItems');
      if (!user) {
        console.log('User not found.');
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Calculate the total price of the cart
      const totalCartPrice = user.cartItems.reduce((total, item) => {
        return total + (item.price || 0); // Ensure item.price is a number
      }, 0);
  
      // Respond with the items in the cart and the total price
      res.status(200).json({
        message: 'Cart items retrieved successfully',
        cartItems: user.cartItems.map(item => ({
          itemId: item._id,
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          sellerId: item.sellerId
        })),
        totalCartPrice: totalCartPrice
      });
    } catch (error) {
      console.error('Error retrieving cart items:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/checkout',authenticateToken, async (req, res) => {
    try {
      const userId=req.user.userId;
      // Validate that userId is provided
      if (typeof userId !== 'string') {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      // Validate the userId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Find the user and populate cart items
      const user = await User.findById(userId).populate('cartItems');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Ensure user has items in the cart
      if (user.cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      // Iterate over each cart item and create an order
      const orders = [];
      for (const item of user.cartItems) {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Create an order
        const order = new Order({
          buyerId: userId,
          sellerId: item.sellerId,
          itemId: item._id,
          amount: item.price,
          hashedOtp: hashedOtp, // Note: In a real application, consider hashing the OTP
          orderStatus: 'pending'
        });
  
        // Save the order in the database
        await order.save();
  
        // Add order to the response array
        orders.push({
          orderId: order._id, // Use the default ObjectId as the order ID
          itemId: item._id,
          itemName: item.name, // Include the item name
          amount: item.price,
          otp: otp, // Return OTP to buyer for verification; ensure secure communication
          message: 'Item added to cart successfully' // Added message
        });
      }
  
      // Clear the user's cart
      user.cartItems = [];
      await user.save();
  
      // Respond with the created orders
      res.status(200).json({
        message: 'Checkout successful',
        orders: orders
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/recd_orders', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Validate the userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Find all orders with matching sellerId and status 'pending'
      const orders = await Order.find({ sellerId: userId, orderStatus: 'pending' })
        .populate('itemId', 'name price') // Populate item name and price
        .populate('buyerId', 'name email'); // Populate buyer's name and email (or other suitable identifiers)
  
      // Format the response
      const formattedOrders = orders.map(order => ({
        orderId: order._id, // Include order ID
        itemName: order.itemId.name,
        itemPrice: order.itemId.price,
        buyerName: order.buyerId.name,
        buyerEmail: order.buyerId.email
      }));
  
      res.status(200).json({
        message: 'Pending orders retrieved successfully',
        orders: formattedOrders
      });
    } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/order_details', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Validate the userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Find pending orders where the user is the buyer
      const pendingOrders = await Order.find({
        buyerId: userId,
        orderStatus: 'pending'
      }).populate('itemId', 'name price');
  
      // Find successful orders where the user is the buyer
      const successfulBoughtOrders = await Order.find({
        orderStatus: 'success',
        buyerId: userId
      }).populate('itemId', 'name price');
  
      // Find successful orders where the user is the seller
      const successfulSoldOrders = await Order.find({
        orderStatus: 'success',
        sellerId: userId
      }).populate('itemId', 'name price');
  
      // Format orders
      const formatOrder = (order) => {
        const item = order.itemId || {};
        return {
          orderId: order._id,
          itemName: item.name || 'Unknown',
          itemPrice: item.price || 0,
          buyerId: order.buyerId,
          sellerId: order.sellerId,
          orderStatus: order.orderStatus
        };
      };
  
      const formattedPendingOrders = pendingOrders.map(formatOrder);
      const formattedSuccessfulBoughtOrders = successfulBoughtOrders.map(formatOrder);
      const formattedSuccessfulSoldOrders = successfulSoldOrders.map(formatOrder);
  
      // Send response with both pending and successful orders
      res.status(200).json({
        message: 'Order details retrieved successfully',
        pendingOrders: formattedPendingOrders,
        successfulBoughtOrders: formattedSuccessfulBoughtOrders,
        successfulSoldOrders: formattedSuccessfulSoldOrders
      });
    } catch (error) {
      console.error('Error retrieving order details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });  
  
  app.post('/cnfm_order', authenticateToken, async (req, res) => {
    try {
      const { orderId } = req.query;
      const { otp } = req.body;
  
      // Validate inputs
      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
      }
      if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
      }
  
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Verify the OTP using bcrypt.compare
      const isOtpValid = await bcrypt.compare(otp, order.hashedOtp);
      if (!isOtpValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Update the order status to 'success'
      order.orderStatus = 'success';
      await order.save();
  
      // Remove the item from the items collection using itemId from the order
      await Item.findByIdAndUpdate(order.itemId, { isSold: true });
  
      // Cancel other orders with the same sellerId and itemId
      await Order.updateMany(
        { 
          _id: { $ne: orderId }, // Exclude the confirmed order
          sellerId: order.sellerId,
          itemId: order.itemId,
          orderStatus: 'pending' // Only cancel pending orders
        },
        { $set: { orderStatus: 'cancelled' } }
      );
  
      // Respond with success message
      res.status(200).json({ message: 'Order confirmed successfully' });
    } catch (error) {
      console.error('Error confirming order:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });  
  
  app.get('/', (req, res) => {
    res.send('E-Commerce API is running....');
  });

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});  

