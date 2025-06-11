// src/components/checkout/ConfirmationStep.jsx
import { useCheckout } from '../../context/CheckoutContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ConfirmationStep() {
    const { orderResponse } = useCheckout();

    if (!orderResponse) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-600 mb-4">¡Oops! Algo salió mal</h2>
                <p>No pudimos obtener la confirmación de tu pedido.</p>
                <Button asChild className="mt-6"><Link to="/">Volver al Inicio</Link></Button>
            </div>
        );
    }
    
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Gracias por tu compra!</h2>
            {orderResponse.method === 'Contra Entrega' ? (
                <p>Tu pedido con ID #{orderResponse.order.orderId} ha sido recibido. Nos pondremos en contacto contigo pronto para confirmar la entrega.</p>
            ) : (
                <p>Tu pago con Wompi fue exitoso. Tu pedido con referencia #{orderResponse.transaction.reference} está siendo procesado.</p>
            )}
            <Button asChild className="mt-6"><Link to="/products">Seguir Comprando</Link></Button>
        </div>
    );
}