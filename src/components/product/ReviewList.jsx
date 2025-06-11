import { useState, useEffect } from 'react';
import { getReviewsByProductId } from '../../services/api';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => (
    <div className="border-b py-4">
        <div className="flex items-center mb-2">
            <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className={`mr-1 ${i < review.Calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
            </div>
            <p className="ml-2 font-bold text-gray-800">{review.Nombre_Usuario}</p>
        </div>
        <p className="text-gray-600">{review.Comentario}</p>
        <p className="text-xs text-gray-400 mt-2">{new Date(review.Fecha_Reseña).toLocaleDateString('es-CO')}</p>
    </div>
);

export default function ReviewList({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) return;
            try {
                const response = await getReviewsByProductId(productId);
                setReviews(response.data.reviews || []);
            } catch (error) {
                console.error("Error al cargar reseñas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    if (loading) return <p>Cargando reseñas...</p>;

    if (reviews.length === 0) {
        return <p>Este producto aún no tiene reseñas. ¡Sé el primero en dejar una!</p>;
    }

    return (
        <div className="space-y-4">
            {reviews.map(review => <ReviewCard key={review.ID_Reseña} review={review} />)}
        </div>
    );
}
