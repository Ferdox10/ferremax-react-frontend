// src/components/checkout/PaymentStep.jsx
import { useState } from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { createWompiTempOrder, createCashOnDeliveryOrder, getFrontendConfig } from '../../services/api';
import { Button } from '@/components/ui/button';
import OrderSummary from './OrderSummary';
import { useWompi } from '../../hooks/useWompi';

export default function PaymentStep() {
    const { shippingDetails, goToNextStep, setOrderResponse, goToPrevStep } = useCheckout();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loadingMethod, setLoadingMethod] = useState(null);
    const [error, setError] = useState('');
    
    const { isWompiReady, error: wompiError } = useWompi();

    const handleWompiPayment = async () => {
        // --- CÓDIGO DE DEPURACIÓN ---
        const wompiPublicKeyFromEnv = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
        console.log("CLAVE PÚBLICA QUE SE USARÁ:", wompiPublicKeyFromEnv);
        alert("Se intentará usar la siguiente llave pública de Wompi:\n\n" + wompiPublicKeyFromEnv);
        // --- FIN DEL CÓDIGO DE DEPURACIÓN ---

        if (!isWompiReady) {
            setError(wompiError || "La pasarela de pago Wompi no está lista. Por favor, espera un momento.");
            return;
        }

        setLoadingMethod('wompi');
        setError('');
        
        try {
            const configResponse = await getFrontendConfig();
            const { wompiPublicKey, redirectUrl: configuredRedirectUrl } = configResponse.data;

            if (!wompiPublicKey) {
                throw new Error("Configuración de pago (Wompi) incompleta desde el servidor.");
            }
            
            const redirectUrl = configuredRedirectUrl || `${window.location.origin}/payment-status`;
            const reference = `ferremax_${Date.now()}`;
            const totalInCents = Math.round(cartTotal * 100);

            await createWompiTempOrder({
                reference, 
                items: cartItems.map(item => ({ productId: item.ID_Producto, quantity: item.quantity, price: item.precio_unitario })),
                total: cartTotal, 
                userId: user?.id, 
                customerData: shippingDetails
            });

            const checkout = new window.WompiCheckout({
                currency: 'COP',
                amountInCents: totalInCents,
                reference: reference,
                publicKey: wompiPublicKeyFromEnv,
                redirectUrl: redirectUrl,
                customerData: { 
                    email: shippingDetails.email, 
                    fullName: shippingDetails.name, 
                    phoneNumber: shippingDetails.phone 
                },
                shippingAddress: { 
                    addressLine1: shippingDetails.address, 
                    city: shippingDetails.city, 
                    region: shippingDetails.department, 
                    country: "CO" 
                }
            });

            checkout.open(function (result) {
                if (result.transaction?.status === 'APPROVED') {
                    setOrderResponse({ success: true, method: 'Wompi', transaction: result.transaction });
                    clearCart();
                    goToNextStep();
                } else {
                   setError(`El pago ${result.transaction?.status?.toLowerCase() || 'fue cancelado'}. Por favor, intenta de nuevo.`);
                   setLoadingMethod(null);
                }
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al preparar el pago con Wompi.');
            setLoadingMethod(null);
        }
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
                 <h2 className="text-xl font-semibold mb-4">Seleccionar Método de Pago</h2>
                 <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                     <p className="text-sm text-gray-600">Revisa tu información de envío antes de continuar.</p>
                     
                     <Button onClick={goToPrevStep} variant="outline" className="w-full" disabled={!!loadingMethod}>
                        Volver y Editar Información
                     </Button>

                     <div className="border-t my-4"></div>
                     
                     {/* --- BOTÓN DE WOMPI REINTEGRADO --- */}
                     <Button 
                        onClick={handleWompiPayment} 
                        disabled={!isWompiReady || !!loadingMethod} 
                        className="w-full"
                     >
                        {loadingMethod === 'wompi' && 'Procesando...'}
                        {loadingMethod !== 'wompi' && !isWompiReady && 'Cargando Wompi...'}
                        {loadingMethod !== 'wompi' && isWompiReady && 'Pagar con Wompi'}
                     </Button>
                     
                     {/* --- BOTÓN DE CONTRA ENTREGA --- */}
                     <Button 
                        onClick={handleCashOnDelivery} 
                        disabled={!!loadingMethod} 
                        className="w-full" 
                        variant="secondary"
                     >
                        {loadingMethod === 'cod' ? 'Procesando...' : 'Pago Contra Entrega'}
                     </Button>

                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                     {wompiError && !error && <p className="text-red-500 text-sm mt-2">{wompiError}</p>}
                 </div>
            </div>
            <OrderSummary />
        </div>
    );
}