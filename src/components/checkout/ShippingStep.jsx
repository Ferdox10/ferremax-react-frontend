// src/components/checkout/ShippingStep.jsx
import { useCheckout } from '../../context/CheckoutContext';
import CheckoutForm from '../common/CheckoutForm';
import OrderSummary from './OrderSummary';

export default function ShippingStep() {
    const { setShippingDetails, goToNextStep } = useCheckout();

    const handleShippingSubmit = (formData) => {
        setShippingDetails(formData);
        goToNextStep();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-semibold mb-4">Información de Envío</h2>
                <CheckoutForm onSubmit={handleShippingSubmit} submitText="Continuar al Pago" />
            </div>
            <OrderSummary />
        </div>
    );
}