import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import Cart from './Cart';
import './App.css';
import AuthForms from './AuthForms';
import logo from './photo/ROG-logo-white.png';
import kvImage from './photo/pixel1.jpg';
import Profile from './Profile'; 
import Checkout from './Checkout';

function Navbar() {
  const token = localStorage.getItem('token'); 

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/home">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </li>
        <li>
          <Link to="/home/cart">Cart</Link>
        </li>
        {token ? (
          <li>
            <Link to="/profile">Profile</Link> 
          </li>
        ) : (
          <li>
            <Link to="/auth">Login</Link> 
          </li>
        )}
      </ul>
    </nav>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { cart, addToCart } = useCart();
  const [showImage, setShowImage] = useState(true);  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data);

        const uniqueCategories = [...new Set(response.data.map((product) => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowImage(false);
      } else {
        setShowImage(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToRegistration = () => {
    navigate('/auth'); 
  };

  return (
    <div>
      <div>
        <div
          className={`welcome-image ${showImage ? '' : 'hide'}`}
          style={{ backgroundImage: `url(${kvImage})` }}
        >
          <div className="welcome-content">
            <h1>
              <span>A</span><span>s</span><span>u</span><span>s</span><span>&nbsp;</span><span>R</span><span>o</span><span>g</span>
            </h1>
            <p>The best gear for gamers and professionals. Start your journey!</p>
            <div className="welcome-buttons">
              <button className="button" onClick={scrollToProducts}>View Products</button>
              <button className="button1" onClick={goToRegistration}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      <div className="catalog-container">
        <h1>Products</h1>

        <input
          type="text"
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="">Select category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <Link to="/home/cart" className="link-cart">
          Go to Cart ({cart.length})
        </Link>

        <div className="products-list" id="products-section">
          {filteredProducts.length === 0 ? (
            <p>No products match the search criteria.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">Category: {product.category}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: ${product.price}</p>
                <button className="button2" onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/home/cart" element={<Cart />} />
        <Route path="/auth" element={<AuthForms />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

function AppWithContext() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
}

export default AppWithContext;
