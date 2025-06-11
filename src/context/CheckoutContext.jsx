// src/context/CheckoutContext.jsx
import { createContext, useState, useContext } from 'react';

const CheckoutContext = createContext();

export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({ children }) => {
    const [step, setStep] = useState(1); // 1: Envío, 2: Pago, 3: Confirmación
    const [shippingDetails, setShippingDetails] = useState(null);
    const [orderResponse, setOrderResponse] = useState(null); // Para guardar la respuesta del pedido

    const goToNextStep = () => setStep(prev => prev + 1);
    const goToPrevStep = () => setStep(prev => prev - 1);
    const resetCheckout = () => {
        setStep(1);
        setShippingDetails(null);
        setOrderResponse(null);
    };

    const value = {
        step,
        shippingDetails,
        orderResponse,
        setShippingDetails,
        setOrderResponse,
        goToNextStep,
        goToPrevStep,
        resetCheckout,
    };

    return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};