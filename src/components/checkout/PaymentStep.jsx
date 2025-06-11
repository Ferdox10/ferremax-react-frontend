// src/components/checkout/PaymentStep.jsx
import { useState, useEffect } from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { createCashOnDeliveryOrder, getExchangeRate } from '../../services/api';
import { Button } from '@/components/ui/button';
import OrderSummary from './OrderSummary';

export default function PaymentStep() {
    const { shippingDetails, goToNextStep, setOrderResponse, goToPrevStep } = useCheckout();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [{ isPending }] = usePayPalScriptReducer();
    const [error, setError] = useState('');
    const [loadingMethod, setLoadingMethod] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(null); // Estado para la tasa
    const [rateError, setRateError] = useState(false);

    useEffect(() => {
        // Pedir la tasa de cambio al montar el componente
        const fetchRate = async () => {
            try {
                console.log("Frontend: Solicitando tasa de cambio al backend...");
                const response = await getExchangeRate();
                // --- LOG DE DEPURACIÓN CRUCIAL ---
                console.log("Frontend: Respuesta recibida del backend:", response.data);
                if (response.data.success && response.data.rate) {
                    console.log("Frontend: Tasa de cambio REAL obtenida:", response.data.rate);
                    setExchangeRate(response.data.rate);
                    setRateError(false);
                } else {
                    // Si el backend falló, nos enviará una tasa de respaldo
                    console.warn("Frontend: La API del backend falló, usando tasa de respaldo.");
                    setExchangeRate(response.data.fallbackRate || 4000);
                    setRateError(true);
                }
            } catch (error) {
                console.error("Frontend: Error de red o del servidor al pedir la tasa. Usando tasa de respaldo final.", error);
                setExchangeRate(4000); // Tasa de respaldo final
                setRateError(true);
            }
        };
        fetchRate();
    }, []);

    const createPayPalOrder = async (data, actions) => {
        if (!exchangeRate) return; // No hacer nada si la tasa no ha cargado
        const totalInUSD = (cartTotal / exchangeRate).toFixed(2);
        console.log(`Total en COP: ${cartTotal}. Tasa: ${exchangeRate}. Total convertido a USD: ${totalInUSD}`);
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalInUSD,
                    currency_code: "USD"
                }
            }]
        });
    };

    const onPayPalApprove = async (data, actions) => {
        const capture = await actions.order.capture();
        console.log("Pago capturado:", capture);
        
        setOrderResponse({ success: true, method: 'PayPal', order: capture });
        clearCart();
        goToNextStep();
    };
    
    const handleCashOnDelivery = async () => {
        setLoadingMethod('cod');
        setError('');
        try {
            const orderData = { 
                cart: cartItems.map(item => ({ productId: item.ID_Producto, quantity: item.quantity, price: item.precio_unitario })), 
                customerInfo: { ...shippingDetails, userId: user?.id } 
            };
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
                 <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <p className="text-sm text-gray-600">Revisa tu información de envío antes de continuar.</p>
                    <Button onClick={goToPrevStep} variant="outline" className="w-full">Volver y Editar Información</Button>
                    <div className="border-t my-4"></div>
                    
                    {rateError && <p className="text-xs text-amber-600 text-center">No se pudo obtener la tasa de cambio en tiempo real. Se usará una tasa de referencia.</p>}
                    {isPending || !exchangeRate ? <p className="text-center">Cargando métodos de pago...</p> : (
                        <PayPalButtons 
                            style={{ layout: "vertical" }}
                            createOrder={createPayPalOrder} 
                            onApprove={onPayPalApprove} 
                        />
                    )}

                    <Button 
                        onClick={handleCashOnDelivery} 
                        disabled={!!loadingMethod} 
                        className="w-full" 
                        variant="secondary"
                    >
                        {loadingMethod === 'cod' ? 'Procesando...' : 'Pago Contra Entrega'}
                    </Button>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                 </div>
            </div>
            <OrderSummary />
        </div>
    );
}