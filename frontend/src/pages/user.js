import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UpdateUser from './updateuser';

function User() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error.response?.data?.message || error.message);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.href = 'http://localhost:5000/logout';
  };

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <div className="navigation-links mb-3">
        <Link to="/user" className="btn btn-link">User Profile</Link>
        <Link to="/mycart" className="btn btn-link">My Cart</Link>
        <Link to="/search" className="btn btn-link">Search Items</Link>
        <Link to="/sell" className="btn btn-link">Sell Items</Link>
        <Link to="/recd_orders" className="btn btn-link">Delivery</Link>
        <Link to="/order_details" className="btn btn-link">Order History</Link>
      </div>
    <div className="user-details">
      <h2>User Profile</h2>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Contact Number:</strong> {user.contactNumber}</p>
      <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
      
      <UpdateUser user={user} onUpdate={handleUpdate} />
    </div>
  </div>
  );
}

export default User;
