import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div style={styles.container}>
      <h1>Welcome to Buy & Sell of IIITH</h1>
      <div style={styles.links}>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.link}>Signup</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  links: {
    marginTop: '20px',
  },
  link: {
    margin: '10px',
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
  },
};

export default Welcome;
