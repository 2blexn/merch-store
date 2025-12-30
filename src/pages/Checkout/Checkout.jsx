import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const shouldScrollToError = useRef(false);

  // Scroll to top of page on open
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll to first error after validation
  useEffect(() => {
    if (shouldScrollToError.current && Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        setTimeout(() => {
          const errorElement = document.getElementById(firstErrorField);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        }, 100);
        shouldScrollToError.current = false;
      }
    }
  }, [errors]);

  // Scroll to top when order is completed
  useEffect(() => {
    if (orderComplete) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderComplete]);

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <h1 className="page-title">Checkout</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="shop-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            <p className="order-number">Order #{(Date.now() % 1000000).toString().padStart(6, '0')}</p>
            <div className="success-actions">
              <button onClick={() => navigate('/products')} className="shop-btn">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s'-]+$/;
    return name.trim().length >= 2 && nameRegex.test(name);
  };

  const validateZipCode = (zipCode) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };

  const validateCardNumber = (cardNumber) => {
    // Remove spaces for validation
    const cleaned = cardNumber.replace(/\s/g, '');
    // Check for digits only and length 13-19 digits
    if (!/^\d{13,19}$/.test(cleaned)) {
      return false;
    }
    // Luhn algorithm for card number validation
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiry) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) {
      return false;
    }
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);
    
    if (expiryYear < currentYear) {
      return false;
    }
    if (expiryYear === currentYear && expiryMonth < currentMonth) {
      return false;
    }
    return true;
  };

  const validateCVC = (cvc) => {
    return /^\d{3,4}$/.test(cvc);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatting for special fields
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'cardExpiry') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cardCVC') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error for this field when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = 'First name must contain at least 2 characters and only letters';
    }

    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Last name must contain at least 2 characters and only letters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must contain at least 5 characters';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!validateName(formData.city)) {
      newErrors.city = 'City must contain at least 2 characters and only letters';
    }

    // ZIP code validation
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!validateZipCode(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    } else if (!validateName(formData.country)) {
      newErrors.country = 'Country must contain at least 2 characters and only letters';
    }

    // Card number validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    // Cardholder name validation
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    } else if (!validateName(formData.cardName)) {
      newErrors.cardName = 'Cardholder name must contain at least 2 characters and only letters';
    }

    // Expiry date validation
    if (!formData.cardExpiry) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!validateExpiryDate(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Please enter a valid expiry date (MM/YY)';
    }

    // CVC validation
    if (!formData.cardCVC) {
      newErrors.cardCVC = 'CVC is required';
    } else if (!validateCVC(formData.cardCVC)) {
      newErrors.cardCVC = 'CVC must contain 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = validateForm();
    
    if (!isValid) {
      shouldScrollToError.current = true;
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearCart();
    setIsProcessing(false);
    setOrderComplete(true);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="page-title">Checkout</h1>
        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <section className="form-section">
              <h2 className="section-title">Shipping Information</h2>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={errors.country ? 'error' : ''}
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>
            </section>

            <section className="form-section">
              <h2 className="section-title">Payment Information</h2>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className={errors.cardName ? 'error' : ''}
                />
                {errors.cardName && <span className="error-message">{errors.cardName}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiry Date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className={errors.cardExpiry ? 'error' : ''}
                  />
                  {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="cardCVC">CVC</label>
                  <input
                    type="text"
                    id="cardCVC"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="4"
                    className={errors.cardCVC ? 'error' : ''}
                  />
                  {errors.cardCVC && <span className="error-message">{errors.cardCVC}</span>}
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="submit-order-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Place Order - $${getCartTotal().toFixed(2)}`}
            </button>
          </form>

          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="summary-item-image"
                  />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <p className="summary-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

