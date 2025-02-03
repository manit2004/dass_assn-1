import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyCart.css'; // Adjust the path according to your project structure

function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/mycart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(response.data.cartItems);
      setTotalPrice(response.data.totalCartPrice);
    } catch (error) {
      console.error('Error retrieving cart items:', error.response?.data?.message || error.message);
      alert('Failed to fetch cart items');
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/cart',
        { itemId, action: 'remove' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      fetchCartItems(); // Refresh the cart items after removal
    } catch (error) {
      console.error('Error removing item from cart:', error.response?.data?.message || error.message);
      alert('Failed to remove item from cart');
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/checkout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders);
      setShowModal(true);
      
      // Clear the cart items after successful checkout
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error('Error during checkout:', error.response?.data?.message || error.message);
      alert('Failed to complete checkout');
    }
  };

  return (
    <div className="cart-container">
      <h2>My Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.itemId} className="cart-item">
              <h4>{item.name}</h4>
              <p><strong>Price:</strong> Rs. {item.price}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <button onClick={() => handleRemoveFromCart(item.itemId)} className="btn btn-danger mt-2">Remove</button>
            </div>
          ))
        )}
      </div>
      <h3>Total Price: Rs. {totalPrice}</h3>
      <button onClick={handleCheckout} className="btn btn-primary mt-3">Proceed to Checkout</button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Checkout Summary</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {orders.length === 0 ? (
                <p>No items in the order.</p>
              ) : (
                <ul>
                  {orders.map((order) => (
                    <li key={order.orderId}>
                      <strong>{order.itemName}</strong> - Rs. {order.amount} <br />
                      OTP: {order.otp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="close-button">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCart;
