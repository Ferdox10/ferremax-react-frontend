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
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, // Usa tu clave de Sandbox o Producción
    currency: "USD", // Cambiado a USD
    intent: "capture",
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
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
    </PayPalScriptProvider>
  </React.StrictMode>,
);