import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [successfulBoughtOrders, setSuccessfulBoughtOrders] = useState([]);
  const [successfulSoldOrders, setSuccessfulSoldOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to view orders.');
        return;
      }

      const response = await axios.get('http://localhost:5000/order_details', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { pendingOrders, successfulBoughtOrders, successfulSoldOrders } = response.data;
      setPendingOrders(pendingOrders);
      setSuccessfulBoughtOrders(successfulBoughtOrders);
      setSuccessfulSoldOrders(successfulSoldOrders);
    } catch (error) {
      console.error('Error retrieving order details:', error.response?.data?.message || error.message);
      setMessage('Failed to retrieve order details.');
    }
  };

  return (
    <div className="orders-container">
      <h2>Order Details</h2>
      {message && <p>{message}</p>}
      
      <h3>Pending Orders</h3>
      {pendingOrders.length === 0 ? (
        <p>No pending orders.</p>
      ) : (
        <ul>
          {pendingOrders.map(order => (
            <li key={order.orderId}>
              <p><strong>Item Name:</strong> {order.itemName}</p>
              <p><strong>Price:</strong> Rs. {order.itemPrice}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
            </li>
          ))}
        </ul>
      )}

      <h3>Successful Bought Orders</h3>
      {successfulBoughtOrders.length === 0 ? (
        <p>No successful bought orders.</p>
      ) : (
        <ul>
          {successfulBoughtOrders.map(order => (
            <li key={order.orderId}>
              <p><strong>Item Name:</strong> {order.itemName}</p>
              <p><strong>Price:</strong> Rs. {order.itemPrice}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
            </li>
          ))}
        </ul>
      )}

      <h3>Successful Sold Orders</h3>
      {successfulSoldOrders.length === 0 ? (
        <p>No successful sold orders.</p>
      ) : (
        <ul>
          {successfulSoldOrders.map(order => (
            <li key={order.orderId}>
              <p><strong>Item Name:</strong> {order.itemName}</p>
              <p><strong>Price:</strong> Rs. {order.itemPrice}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Orders;
