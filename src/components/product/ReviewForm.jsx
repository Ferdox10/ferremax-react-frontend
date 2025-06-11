import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { postReview } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

export default function ReviewForm({ productId, onReviewSubmit }) {
    const { user, isAuthenticated } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState(user?.username || '');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '' || (!isAuthenticated && name.trim() === '')) {
            setStatus({ type: 'error', message: 'Por favor, completa tu nombre, calificación y comentario.' });
            return;
        }
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await postReview(productId, {
                userId: user?.id,
                name: name,
                rating: rating,
                comment: comment,
            });
            setStatus({ type: 'success', message: '¡Reseña enviada con éxito!' });
            setComment('');
            setRating(0);
            if (onReviewSubmit) onReviewSubmit();
        } catch (error) {
            setStatus({ type: 'error', message: 'No se pudo enviar tu reseña.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Escribe tu propia reseña</h3>
            <div className="space-y-4">
                {!isAuthenticated && (
                     <div>
                        <Label htmlFor="name">Tu Nombre</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                )}
                <div>
                    <Label>Tu Calificación</Label>
                    <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                className="cursor-pointer"
                                size={24}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                color={star <= (hoverRating || rating) ? '#facc15' : '#e5e7eb'}
                                fill={star <= (hoverRating || rating) ? '#facc15' : '#e5e7eb'}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <Label htmlFor="comment">Tu Comentario</Label>
                    <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} required rows={4} />
                </div>
                <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Reseña'}</Button>
                {status.message && <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>}
            </div>
        </form>
    );
}
