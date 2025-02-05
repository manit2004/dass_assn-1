import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, Link, useParams } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();
  const {token} = useParams();

  useEffect(() => {
    // get token from url
    if (token){
      console.log(token);
      localStorage.setItem('token', token);
      navigate('/user');
    }
    else{
      console.log('no token');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password, recaptchaToken });
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/user'); // Redirect to a profile or dashboard page
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid email or password');
    }
  };

  const onRecaptchaChange = (value) => {
    console.log(value);
    setRecaptchaToken(value);
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <ReCAPTCHA
          sitekey="6LfQxs0qAAAAAJD5Vvr2rgPdG8Gsixta_JfBL9Z8"
          onChange={onRecaptchaChange}
        />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <Link to="/cas" className="btn btn-link">Login with CAS</Link>
    </div>
  );
}

export default Login;
