import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useProducts } from '../../context/ProductContext';
import { artists } from '../../data/products';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, login } = useAdmin();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    price: '',
    image: '',
    category: 'T-Shirt',
    description: '',
    inStock: true,
  });

  if (!isAdmin) {
    const handleLogin = (e) => {
      e.preventDefault();
      if (login(password)) {
        setError('');
      } else {
        setError('Incorrect password');
      }
    };

    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <p className="hint">Hint: admin123</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        price: parseFloat(formData.price),
      });
      setEditingProduct(null);
    } else {
      addProduct({
        ...formData,
        price: parseFloat(formData.price),
      });
      setShowAddForm(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      artist: '',
      price: '',
      image: '',
      category: 'T-Shirt',
      description: '',
      inStock: true,
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      artist: product.artist,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description,
      inStock: product.inStock,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    resetForm();
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="add-product-btn"
          >
            {showAddForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-section">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Artist</label>
                  <select
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Artist</option>
                    {artists.slice(1).map((artist) => (
                      <option key={artist} value={artist}>
                        {artist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Hoodie">Hoodie</option>
                    <option value="Long Sleeve">Long Sleeve</option>
                    <option value="Sweatpants">Sweatpants</option>
                    <option value="Pajamas">Pajamas</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                  />
                  In Stock
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="admin-products">
          <h2>Products ({products.length})</h2>
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Artist</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="table-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.artist}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span
                        className={`stock-badge ${
                          product.inStock ? 'in-stock' : 'out-of-stock'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(product)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

