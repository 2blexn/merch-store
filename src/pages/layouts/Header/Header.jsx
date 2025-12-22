import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAdmin } from '../../../context/AdminContext';
import './Header.css';

const Header = () => {
  const { getCartItemCount } = useCart();
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const cartCount = getCartItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">MERCH</span>
          <span className="logo-accent">STORE</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">Admin</Link>
          )}
        </nav>

        <div className="header-actions">
          {isAdmin && (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
          <Link to="/cart" className="cart-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

