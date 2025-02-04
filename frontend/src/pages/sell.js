import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Sell() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('clothing'); // Default value for dropdown
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authentication token on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to sell an item.');
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:5000/sell', {
        name,
        price,
        description,
        category,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      setName('');
      setPrice('');
      setDescription('');
      setCategory('clothing');
    } catch (error) {
      console.error('Error listing item for sale:', error.response?.data?.message || error.message);
      setMessage('Failed to list item for sale.');
    }
  };

  return (
    <div className="sell-container">
      <div className="navigation-links mb-3">
        <Link to="/user" className="btn btn-link">User Profile</Link>
        <Link to="/mycart" className="btn btn-link">My Cart</Link>
        <Link to="/search" className="btn btn-link">Search Items</Link>
        <Link to="/sell" className="btn btn-link">Sell Items</Link>
        <Link to="/recd_orders" className="btn btn-link">Delivery</Link>
        <Link to="/order_details" className="btn btn-link">Order History</Link>
      </div>
      <h2>List an Item for Sale</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Item Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (Rs.):</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="clothing">Clothing</option>
            <option value="grocery">Grocery</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">List Item</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Sell;
