# Merch Store - Online Merchandise Shop

A modern, sleek online store built with React for selling official artist merchandise. Features a black and red design theme with white text, payment simulation, and admin panel.

## Features

- **Product Catalog** - Browse products by artist or category
- **Shopping Cart** - Add items, manage quantities, and checkout
- **Payment Simulation** - Simulated checkout process
- **Admin Panel** - Manage products (add, edit, delete)
- **Modern Design** - Black, red, and white color scheme
- **Responsive** - Works on all devices

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Admin Access

To access the admin panel:
1. Navigate to `/admin`
2. Enter password: `admin123`

## Project Structure

```
src/
├── components/     # Reusable components (Header, Footer, ProductCard)
├── context/       # React contexts (Cart, Products, Admin)
├── data/          # Product data
├── pages/          # Page components (Home, Products, Cart, etc.)
└── App.jsx         # Main app component with routing
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- React 18
- React Router DOM
- Vite
- CSS3

## Notes

- Product images are located in the `public` folder
- Cart data is stored in localStorage
- Admin authentication is simplified (password: admin123)
- Payment processing is simulated (no real transactions)
- All assets have been copied to the `public` folder for proper serving
