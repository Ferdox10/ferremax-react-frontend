// src/components/checkout/OrderSummary.jsx
import { useCart } from '../../hooks/useCart';

export default function OrderSummary() {
    const { cartItems, cartSubtotal, shipping, tax, cartTotal } = useCart();
    const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Resumen del Pedido</h2>
            <div className="space-y-2 mb-4">
                {cartItems.map(item => (
                    <div key={item.ID_Producto} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.Nombre} x {item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.precio_unitario * item.quantity)}</span>
                    </div>
                ))}
            </div>
            <div className="space-y-2 text-gray-700 border-t pt-2">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
                <div className="flex justify-between"><span>Envío</span><span>{formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span>IVA (19%)</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2"><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
            </div>
             <p className="text-xs text-gray-500 mt-4">Política de Devolución: Tienes 30 días para devolver productos en su empaque original.</p>
        </div>
    );
}