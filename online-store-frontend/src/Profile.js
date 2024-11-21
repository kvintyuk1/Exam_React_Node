import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/auth');
    } else {
      axios
        .get('http://localhost:5000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
        .catch((error) => {
          console.error(error);
          navigate('/auth');
        });

      axios
        .get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setOrders(response.data))
        .catch((error) => console.error(error));
    }
  }, [navigate]); 

  const logout = () => {
    localStorage.removeItem('token');  
    navigate('/auth'); 
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-heading">Your Profile</h1>
      {user && (
        <div className="user-info">
          <p className="user-info-item"><strong>Name:</strong> {user.name}</p>
          <p className="user-info-item"><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <h2 className="orders-heading">Your Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p className="order-detail"><strong>Order ID:</strong> {order._id}</p>
            <p className="order-detail"><strong>Status:</strong> {order.status}</p>
            <p className="order-detail"><strong>Total:</strong> ${order.totalAmount}</p>
            <p className="order-detail"><strong>Name:</strong> {order.name}</p>
            <p className="order-detail"><strong>Address:</strong> {order.address}</p>
            <p className="order-detail"><strong>Phone Number:</strong> {order.phoneNumber}</p>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.productId._id} className="order-item">{item.productId.name}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="no-orders">No orders found.</p>
      )}
      
      <button className="logout-button" onClick={logout}>Logout</button>
    </div>
  );
}

export default Profile;
