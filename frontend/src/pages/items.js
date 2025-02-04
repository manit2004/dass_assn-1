import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Items() {
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract itemId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const itemId = queryParams.get('itemId');

  useEffect(() => {
    // Check for authentication token on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchItemDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { itemId },
        });

        setItem(response.data);
      } catch (error) {
        console.error('Error retrieving item details:', error.response?.data?.message || error.message);
        alert('Failed to fetch item details');
      }
    };

    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId, navigate]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/cart',
        { itemId, action: 'add' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      navigate('/mycart');
    } catch (error) {
      console.error('Error adding item to cart:', error.response?.data?.message || error.message);
      alert('Failed to add item to cart');
    }
  };

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <div className="item-details">
      <h2>{item.name}</h2>
      <p><strong>Price:</strong> Rs. {item.price}</p>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Seller:</strong> {item.seller.name} ({item.seller.email})</p>
      <button onClick={handleAddToCart} className="btn btn-primary mt-3">Add to Cart</button>
    </div>
  );
}

export default Items;
