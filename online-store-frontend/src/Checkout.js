import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from './context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); 

    if (!token) {
      setErrorMessage("You need to log in to place an order.");
      setLoading(false);
      navigate('/auth'); 
      return; 
    }

    try {
      const orderData = {
        items: cart.map(item => ({ productId: item._id, quantity: 1 })),
        totalAmount: calculateTotal(),
        address,
        name,
        surname,
        phoneNumber,
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Order response:', response);

      if (response.status === 201) {
        clearCart();
        setSuccessMessage("Your order has been placed successfully!");
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setSuccessMessage("There was an error placing your order. Please try again.");
      }
    } catch (err) {
      console.error('Error creating order:', err.response ? err.response.data : err.message);
      setSuccessMessage("There was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="order-detail">Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-menu">
          {cart.map((item) => (
            <div key={item._id} className="menu-item">
              <h3 className="order-detail">{item.name}</h3>
              <p className="order-detail">Price: ${item.price}</p>
            </div>
          ))}
          <h3 className="order-detail">Total: ${calculateTotal()}</h3>
        </div>

        <div className="checkout-form">
          {errorMessage && <div className="error-message">{errorMessage}</div>} 
          
          {!isLoggedIn && (
            <div className="error-message">You need to log in to place an order.</div>
          )}

          <div className="form-field">
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Surname:</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <button
            className="button4"
            onClick={handleCheckout}
            disabled={loading || !isLoggedIn} 
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>

          {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
