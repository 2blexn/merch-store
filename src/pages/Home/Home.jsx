import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { artists } from '../../data/products';
import ProductCard from '../Products/ProductCards/ProductCard';
import './Home.css';

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            OFFICIAL <span className="hero-accent">MERCHANDISE</span>
          </h1>
          <p className="hero-subtitle">
            Get exclusive merchandise from your favorite artists
          </p>
          <Link to="/products" className="hero-cta">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="artists-section">
        <h2 className="section-title">Shop by Artist</h2>
        <div className="artists-grid">
          {artists.slice(1).map((artist) => {
            const artistProducts = products.filter(p => p.artist === artist);
            const getArtistImagePath = (artistName) => {
              const nameMap = {
                'Lil Peep': 'lil peep.jpg',
                'Playboi Carti': 'playboi carti.jpg',
                'Trippie Redd': 'trippie red.jpg',
                'Snoop Dogg': 'snoop dog.webp',
                'Scarlxrd': 'scarlxrd.jpeg'
              };
              return `/rappers photo/${nameMap[artistName] || 'playboi carti.jpg'}`;
            };
            
            return (
              <Link
                key={artist}
                to={`/products?artist=${encodeURIComponent(artist)}`}
                className="artist-card"
              >
                <div className="artist-image-container">
                  <img
                    src={getArtistImagePath(artist)}
                    alt={artist}
                    className="artist-image"
                    onError={(e) => {
                      e.target.src = artistProducts[0]?.image || '/rappers photo/playboi carti.jpg';
                    }}
                  />
                  <div className="artist-overlay">
                    <h3 className="artist-name">{artist}</h3>
                    <p className="artist-count">{artistProducts.length} items</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="section-footer">
          <Link to="/products" className="view-all-btn">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

