import React, { useState } from 'react';
import './AuthForms.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function AuthForms() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    reEnterPassword: '',
  });

  const navigate = useNavigate(); 

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginActive ? 'http://localhost:5000/auth/login' : 'http://localhost:5000/auth/register'; 
    try {
      const response = await axios.post(url, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      alert(response.data.message || 'Success!');

      if (isLoginActive && response.data.token) {
        localStorage.setItem('token', response.data.token); 
        navigate('/home'); 
      } else if (!isLoginActive) {
        setIsLoginActive(true); 
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={handleSubmit}
        className={`auth-form ${isLoginActive ? 'login-form is-active' : ''}`}
      >
        <div className="form-header">
          <h2>Welcome Back!</h2>
          <p>Log in to continue shopping</p>
        </div>
        <div className="form-element">
          <span><i className="fa fa-envelope"></i></span>
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-element">
          <span><i className="fa fa-lock"></i></span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="form-button">Login</button>
      </form>

      <form
        onSubmit={handleSubmit}
        className={`auth-form ${!isLoginActive ? 'register-form is-active' : ''}`}
      >
        <div className="form-header">
          <h2>Join Our Store!</h2>
          <p>Create an account to start shopping</p>
        </div>
        <div className="form-element">
          <span><i className="fa fa-user"></i></span>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required={!isLoginActive}
          />
        </div>
        <div className="form-element">
          <span><i className="fa fa-envelope"></i></span>
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-element">
          <span><i className="fa fa-lock"></i></span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-element">
          <span><i className="fa fa-lock"></i></span>
          <input
            type="password"
            name="reEnterPassword"
            placeholder="Re-Enter Password"
            value={formData.reEnterPassword}
            onChange={handleChange}
            required={!isLoginActive}
          />
        </div>
        <button type="submit" className="form-button">Register</button>
      </form>

      <div className="toggle-links">
        <div
          className={`toggle-link ${!isLoginActive ? 'is-active' : ''}`}
          onClick={toggleForm}
        >
          Don't have an account? <a href="#">Sign Up</a>
        </div>
        <div
          className={`toggle-link ${isLoginActive ? 'is-active' : ''}`}
          onClick={toggleForm}
        >
          Already have an account? <a href="#">Login</a>
        </div>
      </div>
    </div>
  );
}

export default AuthForms;
