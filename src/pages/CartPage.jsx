import React from 'react';
import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import SuggestedProducts from '../components/product/SuggestedProducts';
import PageTransition from '../components/common/PageTransition';

export default function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartSubtotal,
    shipping,
    tax,
    cartTotal,
    FREE_SHIPPING_THRESHOLD
  } = useCart();
  
  const navigate = useNavigate();

  const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-6">Parece que no has añadido nada a tu carrito todavía.</p>
        <Button asChild><Link to="/products">Explorar productos</Link></Button>
      </div>
    );
  }

  const amountForFreeShipping = FREE_SHIPPING_THRESHOLD - cartSubtotal;
  const freeShippingProgress = Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Columna de Items */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Carrito de Compras ({cartItems.length})</h1>
            <Button variant="outline" onClick={clearCart} className="text-red-600 border-red-300 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" /> Vaciar Carrito
            </Button>
          </div>

          {cartItems.map(item => (
            <div key={item.ID_Producto} className="flex bg-white p-4 rounded-lg shadow-sm">
              <img src={item.imagen_url || 'https://placehold.co/150x150/e2e8f0/64748b?text=NI'} alt={item.Nombre} className="w-24 h-24 object-contain rounded-md mr-4" />
              <div className="flex-grow flex flex-col justify-between">
                  <div>
                      <h2 className="font-semibold text-lg">{item.Nombre}</h2>
                      <p className="text-sm text-gray-500">Marca: {item.Marca} | Stock: {item.cantidad}</p>
                      <p className="text-sm font-semibold">{formatPrice(item.precio_unitario)} por unidad</p>
                  </div>
                  <div className="flex items-center mt-2">
                      <div className="flex items-center border rounded-md">
                          <button onClick={() => updateQuantity(item.ID_Producto, item.quantity - 1)} className="p-2 disabled:opacity-50" disabled={item.quantity <= 1}><Minus size={16}/></button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.ID_Producto, item.quantity + 1)} className="p-2 disabled:opacity-50" disabled={item.quantity >= item.cantidad}><Plus size={16}/></button>
                      </div>
                  </div>
              </div>
              <div className="text-right flex flex-col justify-between items-end">
                   <p className="font-bold text-lg">{formatPrice(item.precio_unitario * item.quantity)}</p>
                   <button onClick={() => removeFromCart(item.ID_Producto)} className="text-gray-400 hover:text-red-500 mt-auto"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>

        {/* Columna de Resumen */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Resumen del Pedido</h2>
              <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between"><span>Subtotal ({cartItems.length} artículos)</span> <span>{formatPrice(cartSubtotal)}</span></div>
                  <div className="flex justify-between"><span>Envío</span> <span>{shipping > 0 ? formatPrice(shipping) : 'Gratis'}</span></div>
                  <div className="flex justify-between"><span>IVA (19%)</span> <span>{formatPrice(tax)}</span></div>
                  <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2"><span>Total</span> <span>{formatPrice(cartTotal)}</span></div>
              </div>

              {amountForFreeShipping > 0 && (
                  <div className="mt-4 text-center bg-orange-100 text-orange-800 p-2 rounded-md text-sm">
                      <p>Agrega <strong>{formatPrice(amountForFreeShipping)}</strong> más para obtener envío gratuito.</p>
                      <div className="w-full bg-orange-200 rounded-full h-2.5 mt-2">
                          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${freeShippingProgress}%` }}></div>
                      </div>
                  </div>
              )}
              
              <div className="mt-6 space-y-3">
                   <Button onClick={() => navigate('/checkout')} className="w-full" size="lg">Proceder al Checkout</Button>
                   <Button asChild variant="outline" className="w-full"><Link to="/products">Continuar Comprando</Link></Button>
              </div>
              <ul className="text-xs text-gray-500 mt-4 space-y-1 list-disc list-inside">
                  <li>Envío gratuito en pedidos superiores a {formatPrice(FREE_SHIPPING_THRESHOLD)}</li>
                  <li>Devoluciones gratuitas en 30 días</li>
                  <li>Atención al cliente 24/7</li>
              </ul>
          </div>
        </div>
      </div>

      <SuggestedProducts currentCartIds={cartItems.map(item => item.ID_Producto)} />
    </PageTransition>
  );
}