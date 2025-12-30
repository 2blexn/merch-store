import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AdminProvider } from './context/AdminContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './pages/layouts/Header/Header';
import Footer from './pages/layouts/Footer/Footer';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/Products/ProductDetails/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Admin from './pages/Admin/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <AdminProvider>
        <ProductProvider>
          <CartProvider>
            <ScrollToTop />
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ProductProvider>
      </AdminProvider>
    </Router>
  );
}

export default App;

