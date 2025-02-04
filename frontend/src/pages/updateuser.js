import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateUser({ user, onUpdate }) {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [age, setAge] = useState(user.age || '');
  const [contactNumber, setContactNumber] = useState(user.contactNumber || '');
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
        alert('You must be logged in to update your information.');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/updateUser',
        { firstName, lastName, age, contactNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      onUpdate(response.data.user); // Update the user state in the parent component
    } catch (error) {
      console.error('Error updating user:', error.response?.data?.message || error.message);
      alert('Failed to update user information');
    }
  };

  return (
    <div className="update-user-form">
      <h3>Update User Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Age</label>
          <input
            type="number"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Contact Number</label>
          <input
            type="text"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}

export default UpdateUser;
