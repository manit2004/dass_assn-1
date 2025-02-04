import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './search.css';

function Search() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authentication token on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          name,
          category,
        },
      });

      setItems(response.data.items);
    } catch (error) {
      console.error('Error retrieving items:', error.response?.data?.message || error.message);
      alert('Failed to fetch items');
    }
  };

  const handleItemClick = (itemId) => {
    // Navigate using query parameter
    navigate(`/items?itemId=${itemId}`);
  }

  return (
    <div className="search-container">
      <h2>Search Items</h2>
      <div className="navigation-links mb-3">
        <Link to="/user" className="btn btn-link">User Profile</Link>
        <Link to="/mycart" className="btn btn-link">My Cart</Link>
        <Link to="/search" className="btn btn-link">Search Items</Link>
        <Link to="/sell" className="btn btn-link">Sell Items</Link>
        <Link to="/recd_orders" className="btn btn-link">Delivery</Link>
        <Link to="/order_details" className="btn btn-link">Order History</Link>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control mt-2"
        >
          <option value="">Select Category</option>
          <option value="clothing">Clothing</option>
          <option value="grocery">Grocery</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="other">Other</option>
        </select>
        <button onClick={handleSearch} className="btn btn-primary mt-2">Search</button>
      </div>

      <div className="items-list mt-4">
        {items.map((item) => (
          <div key={item.itemId} className="item-tile" onClick={() => handleItemClick(item.itemId)}>
            <h4>{item.name}</h4>
            <p><strong>Price:</strong> Rs. {item.price}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Seller:</strong> {item.seller.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
