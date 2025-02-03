import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ConfirmOrder() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Parse the orderId from the query string
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  // Debugging logs
  console.log('Order ID:', orderId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to confirm orders.');
        return;
      }

      const response = await axios.post(`http://localhost:5000/cnfm_order?orderId=${orderId}`, {
        otp,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      navigate('/recd_orders'); // Redirect back to pending orders after confirmation
    } catch (error) {
      console.error('Error confirming order:', error.response?.data?.message || error.message);
      setMessage('Failed to confirm order.');
    }
  };

  return (
    <div className="confirm-order-container">
      <h2>Confirm Order</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Submit OTP</button>
      </form>
    </div>
  );
}

export default ConfirmOrder;
