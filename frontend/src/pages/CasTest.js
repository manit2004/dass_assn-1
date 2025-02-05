import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CasTest() {
  const navigate = useNavigate();

  useEffect(() => {
    // This function attempts to fetch the token after CAS authentication
    const fetchCasData = async () => {
      try {
        // Make a request to the /cas route on the backend
        window.location.href = 'http://localhost:5000/cas';
        const response = await axios.get('http://localhost:5000/cas', { withCredentials: true });

        // Assuming the response contains the token as { token: 'your_jwt_token' }
        const { token } = response.data;

        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Redirect to /user
        navigate('/user');
      } catch (err) {
        console.error('Failed to authenticate via CAS.', err);
      }
    };

    // Redirect to CAS login page
    

    // Optionally, you can attempt to fetch the token once the user is redirected back
    // This part of the code assumes the CAS service will redirect back to your app
    fetchCasData();
  }, [navigate]);

  return (
    <div>
      <h1>CAS Authentication Test</h1>
      <p>Redirecting to CAS login...</p>
    </div>
  );
}

export default CasTest;
