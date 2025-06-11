// src/pages/PaymentStatusPage.jsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentStatusPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const id = searchParams.get('id');
        // Aquí podrías hacer una llamada a tu backend para obtener el estado final de la transacción con ese ID si fuera necesario.
        // Por ahora, simplemente redirigimos al inicio.
        console.log("Transacción de Wompi finalizada con ID:", id);

        // Redirigir al usuario a una página de confirmación o de inicio después de un momento.
        setTimeout(() => {
            navigate('/'); // O a una página de "mis pedidos"
        }, 3000); 

    }, [searchParams, navigate]);

    return (
        <div className="text-center p-10">
            <h1 className="text-2xl font-bold">Procesando tu pago...</h1>
            <p className="mt-4">Gracias por tu compra. Estamos confirmando el estado de tu transacción.</p>
            <p>Serás redirigido en unos segundos.</p>
        </div>
    );
}