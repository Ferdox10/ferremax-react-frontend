// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Asegúrate de que este es tu archivo de Tailwind
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { CompareProvider } from './context/CompareContext.jsx';
import { CheckoutProvider } from './context/CheckoutContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <CompareProvider>
            <CheckoutProvider>
            <App />
            </CheckoutProvider>
          </CompareProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);