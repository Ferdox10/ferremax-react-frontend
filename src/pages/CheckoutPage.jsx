// src/pages/CheckoutPage.jsx
import React, { useEffect } from 'react';
import { useCheckout } from '../context/CheckoutContext';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import ShippingStep from '../components/checkout/ShippingStep';
import PaymentStep from '../components/checkout/PaymentStep';
import ConfirmationStep from '../components/checkout/ConfirmationStep';

// Componente para la barra de progreso
const StepIndicator = ({ currentStep }) => {
    const steps = ['Envío', 'Pago', 'Confirmación'];
    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep > index ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {currentStep > index ? '✓' : index + 1}
                        </div>
                        <span className={`ml-2 ${currentStep > index ? 'text-orange-500 font-semibold' : 'text-gray-500'}`}>{step}</span>
                    </div>
                    {index < steps.length - 1 && <div className="flex-auto border-t-2 mx-4 border-gray-200"></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default function CheckoutPage() {
    const { step, resetCheckout } = useCheckout();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    // Resetear el checkout al montar la página
    useEffect(() => {
        resetCheckout();
    }, []);

    // Si el carrito está vacío, redirigir
    useEffect(() => {
        if (cartItems.length === 0 && step !== 3) {
            navigate('/cart');
        }
    }, [cartItems, step, navigate]);

    const renderStep = () => {
        switch (step) {
            case 1: return <ShippingStep />;
            case 2: return <PaymentStep />;
            case 3: return <ConfirmationStep />;
            default: return <ShippingStep />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Checkout</h1>
            <StepIndicator currentStep={step} />
            {renderStep()}
        </div>
    );
}