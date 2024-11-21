import React from 'react';
import { useCart } from './context/CartContext'; 
import { useNavigate } from 'react-router-dom'; 
import './App.css'; 

function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate(); 

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/checkout'); 
  };

  return (
    <div className="cart-container">
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <div>
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
              </div>
              <button
                className="button3"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
          <h3 className="cart-total">Total: ${calculateTotal()}</h3>
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
