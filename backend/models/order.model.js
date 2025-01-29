import mongoose from 'mongoose';

// Define the Order schema
const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  hashedOtp: {
    type: String,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['success', 'cancelled', 'pending'],
    default: 'pending'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

export default Order;
