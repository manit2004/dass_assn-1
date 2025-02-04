import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link} from 'react-router-dom';

function Delivery() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [orderIdToConfirm, setOrderIdToConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authentication token on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchPendingOrders();
  }, [navigate]);

  const fetchPendingOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/recd_orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Fetched Orders:', response.data.orders); // Log to verify orders
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error retrieving orders:', error.response?.data?.message || error.message);
      setMessage('Failed to retrieve orders.');
    }
  };

  const handleConfirmClick = (orderId) => {
    console.log('Order ID to Confirm:', orderId); // Log to verify ID
    setOrderIdToConfirm(orderId);
    setShowOtpModal(true);
  };

  const confirmOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(`http://localhost:5000/cnfm_order?orderId=${orderIdToConfirm}`, {
        otp,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      setShowOtpModal(false);
      setOtp('');
      fetchPendingOrders(); // Refresh the list after confirming an order
    } catch (error) {
      console.error('Error confirming order:', error.response?.data?.message || error.message);
      alert('Failed to confirm order.');
    }
  };

  return (
    <div className="delivery-container">
      <div className="navigation-links mb-3">
        <Link to="/user" className="btn btn-link">User Profile</Link>
        <Link to="/mycart" className="btn btn-link">My Cart</Link>
        <Link to="/search" className="btn btn-link">Search Items</Link>
        <Link to="/sell" className="btn btn-link">Sell Items</Link>
        <Link to="/recd_orders" className="btn btn-link">Delivery</Link>
        <Link to="/order_details" className="btn btn-link">Order History</Link>
      </div>
      <h2>Pending Orders</h2>
      {message && <p>{message}</p>}
      {orders.length === 0 ? (
        <p>No pending orders.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.orderId}>
              <p><strong>Item Name:</strong> {order.itemName}</p>
              <p><strong>Price:</strong> Rs. {order.itemPrice}</p>
              <p><strong>Buyer Name:</strong> {order.buyerName}</p>
              <p><strong>Buyer Email:</strong> {order.buyerEmail}</p>
              <button onClick={() => handleConfirmClick(order.orderId)} className="btn btn-primary">
                Confirm Order
              </button>
            </li>
          ))}
        </ul>
      )}

      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <button onClick={confirmOrder} className="btn btn-success">Submit OTP</button>
            <button onClick={() => setShowOtpModal(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Delivery;
