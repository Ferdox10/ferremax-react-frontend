// src/components/checkout/PaymentStep.jsx
import { useState } from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { createCashOnDeliveryOrder } from '../../services/api';
import { Button } from '@/components/ui/button';
import OrderSummary from './OrderSummary';

export default function PaymentStep() {
    const { shippingDetails, goToNextStep, setOrderResponse, goToPrevStep } = useCheckout();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loadingMethod, setLoadingMethod] = useState(null); // 'wompi', 'cod', o null
    const [error, setError] = useState('');

    const handleCashOnDelivery = async () => {
        setLoadingMethod('cod');
        setError('');
        try {
            const orderData = { cart: cartItems.map(item => ({ productId: item.ID_Producto, quantity: item.quantity, price: item.precio_unitario })), customerInfo: { ...shippingDetails, userId: user?.id } };
            const response = await createCashOnDeliveryOrder(orderData);
            setOrderResponse({ success: true, method: 'Contra Entrega', order: response.data });
            clearCart();
            goToNextStep();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar el pedido.');
        } finally {
            setLoadingMethod(null);
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                 <h2 className="text-xl font-semibold mb-4">Seleccionar Método de Pago</h2>
                 <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                     <p className="text-sm text-gray-600">Revisa tu información de envío antes de continuar.</p>
                     <Button onClick={goToPrevStep} variant="outline" className="w-full" disabled={!!loadingMethod}>
                        Volver y Editar Información
                     </Button>
                     <div className="border-t my-4"></div>
                     <Button onClick={handleCashOnDelivery} disabled={!!loadingMethod} className="w-full" variant="secondary">
                        {loadingMethod === 'cod' ? 'Procesando...' : 'Pago Contra Entrega'}
                     </Button>
                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                 </div>
            </div>
            <OrderSummary />
        </div>
    );
}