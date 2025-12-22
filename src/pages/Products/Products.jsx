import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { artists } from '../../data/products';
import ProductCard from './ProductCards/ProductCard';
import './Products.css';

const Products = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArtist, setSelectedArtist] = useState(
    searchParams.get('artist') || 'All Artists'
  );
  const [sortBy, setSortBy] = useState('name');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedArtist !== 'All Artists') {
      filtered = filtered.filter((p) => p.artist === selectedArtist);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [products, selectedArtist, sortBy]);

  const handleArtistChange = (artist) => {
    setSelectedArtist(artist);
    if (artist === 'All Artists') {
      setSearchParams({});
    } else {
      setSearchParams({ artist });
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="page-title">Products</h1>
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="artist-filter">Artist:</label>
            <select
              id="artist-filter"
              value={selectedArtist}
              onChange={(e) => handleArtistChange(e.target.value)}
              className="filter-select"
            >
              {artists.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="sort-filter">Sort by:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="products-content">
        {filteredAndSortedProducts.length > 0 ? (
          <div className="products-grid">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

