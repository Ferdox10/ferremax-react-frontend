// src/pages/ProductDetailPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getReviewsByProductId } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/dist/inner-image-zoom.css';
import { Star, Heart, Share2, Truck, ShieldCheck, Undo2, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import copy from 'copy-to-clipboard';
import ReviewList from '../components/product/ReviewList';
import ReviewForm from '../components/product/ReviewForm';

const StarRating = ({ rating = 0, size = 20 }) => {
    const totalStars = 5;
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, i) => (
                <Star key={i} className={i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} size={size} />
            ))}
        </div>
    );
};

const ImageModal = ({ images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const goToPrevious = (e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1)); };
    const goToNext = (e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1)); };
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') goToPrevious(e);
            if (e.key === 'ArrowRight') goToNext(e);
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <button onClick={goToPrevious} className="absolute left-4 text-white p-2 bg-white/20 rounded-full hover:bg-white/40"><ChevronLeft size={32} /></button>
            <img src={images[currentIndex]} alt="Vista ampliada" className="max-w-[85%] max-h-[85%] object-contain" />
            <button onClick={goToNext} className="absolute right-4 text-white p-2 bg-white/20 rounded-full hover:bg-white/40"><ChevronRight size={32} /></button>
        </div>
    );
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('especificaciones');
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [reviewKey, setReviewKey] = useState(0); // Para forzar la recarga de la lista

  useEffect(() => {
    const fetchProductAndReviews = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [productRes, reviewsRes] = await Promise.all([
                getProductById(id),
                getReviewsByProductId(id)
            ]);
            setProduct(productRes.data);
            setReviews(reviewsRes.data.reviews || []);
            setMainImage(productRes.data.imagen_url || 'https://placehold.co/600x400');
        } catch (err) {
            setError('No se pudo encontrar el producto.');
        } finally {
            setLoading(false);
        }
    };
    fetchProductAndReviews();
  }, [id, reviewKey]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.Calificacion, 0);
    return total / reviews.length;
  }, [reviews]);

  if (loading) return <p className="text-center p-10">Cargando producto...</p>;
  if (error) return <p className="text-center text-red-500 p-10">{error}</p>;
  if (!product) return <p className="text-center p-10">Producto no encontrado.</p>;

  const images = [product.imagen_url, product.imagen_url_2, product.imagen_url_3, product.imagen_url_4, product.imagen_url_5].filter(Boolean);
  const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  const isOutOfStock = product.cantidad <= 0;

  const handleQuantity = (amount) => { setQuantity(prev => Math.max(1, Math.min(product.cantidad, prev + amount))); };
  const handleShare = () => { copy(window.location.href); alert('¡Enlace copiado!'); };
  const openImageModal = (index) => { setModalImageIndex(index); setIsModalOpen(true); };

  return (
    <div className="bg-gray-50 p-2 sm:p-4">
        <nav className="text-sm text-gray-500 mb-4 truncate">
            <Link to="/" className="hover:text-orange-500">Inicio</Link> > 
            <Link to="/products" className="hover:text-orange-500"> Productos</Link> > 
            <Link to={`/products?category=${encodeURIComponent(product.Marca)}`} className="hover:text-orange-500"> {product.Marca}</Link> >
            <span className="text-gray-700"> {product.Nombre}</span>
        </nav>
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                    <div className="border rounded-lg overflow-hidden cursor-pointer mb-3" onClick={() => openImageModal(images.indexOf(mainImage))}>
                        <InnerImageZoom src={mainImage || (images.length > 0 ? images[0] : '')} zoomSrc={mainImage || (images.length > 0 ? images[0] : '')} alt={product.Nombre} zoomType="hover"/>
                    </div>
                    {images.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {images.map((img, index) => <img key={index} src={img} alt={`Miniatura ${index + 1}`} onClick={() => setMainImage(img)} className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-orange-500' : 'border-transparent'}`}/>)}
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{product.Nombre}</h1>
                    <div className="flex items-center gap-4 my-2">
                        <div className="flex items-center">
                           <StarRating rating={averageRating} />
                           <span className="ml-2 text-sm text-gray-600">({Number(averageRating).toFixed(1)}) - {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}</span>
                        </div>
                        <span className="text-sm text-gray-500">{product.Marca}</span>
                    </div>
                    <p className="text-gray-500 mb-4">IVA incluido</p>
                    <p className="text-gray-700 mb-6">{product.Descripcion}</p>
                    <p className="text-4xl font-bold text-gray-800 mb-4">{formatPrice(product.precio_unitario)}</p>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="font-semibold">Cantidad:</span>
                        <div className="flex items-center border rounded-md"><button onClick={() => handleQuantity(-1)} className="p-2" disabled={quantity <= 1}><Minus size={16}/></button><span className="px-4 font-semibold">{quantity}</span><button onClick={() => handleQuantity(1)} className="p-2" disabled={quantity >= product.cantidad}><Plus size={16}/></button></div>
                        <span className="text-sm text-gray-500">({product.cantidad} disponibles)</span>
                    </div>
                    <div className="flex items-stretch gap-3">
                        <button onClick={() => addToCart(product, quantity)} disabled={isOutOfStock} className="flex-1 py-3 px-6 text-white bg-orange-600 rounded-md font-semibold hover:bg-orange-700 disabled:bg-gray-400">Agregar al Carrito</button>
                        <button onClick={() => toggleFavorite(product.ID_Producto)} className={`p-3 border rounded-md ${isFavorite(product.ID_Producto) ? 'bg-red-100 border-red-500 text-red-500' : 'hover:bg-gray-100'}`}><Heart /></button>
                        <button onClick={handleShare} className="p-3 border rounded-md hover:bg-gray-100"><Share2 /></button>
                    </div>
                     <div className="grid grid-cols-3 gap-4 text-center mt-8 text-sm text-gray-600">
                        <div className="flex flex-col items-center"><Truck className="mb-1"/> Envío rápido</div>
                        <div className="flex flex-col items-center"><ShieldCheck className="mb-1"/> Garantía incluida</div>
                        <div className="flex flex-col items-center"><Undo2 className="mb-1"/> Devolución fácil</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mt-8">
            <div className="border-b mb-4"><nav className="flex space-x-6"><button onClick={() => setActiveTab('especificaciones')} className={`pb-2 font-semibold ${activeTab === 'especificaciones' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>Especificaciones</button><button onClick={() => setActiveTab('envio')} className={`pb-2 font-semibold ${activeTab === 'envio' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>Envío</button><button onClick={() => setActiveTab('reseñas')} className={`pb-2 font-semibold ${activeTab === 'reseñas' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>Reseñas ({reviews.length})</button></nav></div>
            <div>
                {activeTab === 'especificaciones' && ( /* ... */ )}
                {activeTab === 'envio' && ( /* ... */ )}
                {activeTab === 'reseñas' && (
                    <div>
                        <ReviewList productId={product.ID_Producto} key={reviewKey} />
                        <ReviewForm productId={product.ID_Producto} onReviewSubmit={() => setReviewKey(prev => prev + 1)} />
                    </div>
                )}
            </div>
        </div>
        {isModalOpen && <ImageModal images={images} initialIndex={modalImageIndex} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}