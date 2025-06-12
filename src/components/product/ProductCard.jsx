import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import { useCompare } from '../../hooks/useCompare'; // Importar hook
import { FaHeart, FaBalanceScale } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Componente para mostrar las estrellas de calificación
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
        );
    }
    return <div className="flex">{stars}</div>;
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toggleCompare, isInCompare } = useCompare();

  // AHORA USAMOS LOS DATOS REALES QUE VIENEN DE LA API
  const rating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;

  const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  const isOutOfStock = product.cantidad <= 0;

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-xl relative border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 flex-grow">
            <div className="absolute top-2 right-2 flex flex-col space-y-2">
                <button onClick={() => toggleFavorite(product.ID_Producto)} className={`p-2 rounded-full bg-white/80 shadow ${isFavorite(product.ID_Producto) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}><FaHeart /></button>
            </div>
            <Link to={`/products/${product.ID_Producto}`} className="block text-center">
                <img src={product.imagen_url || 'https://placehold.co/200x200'} alt={product.Nombre} className="w-full h-40 object-contain mb-2" />
            </Link>
            <span className="text-xs font-semibold uppercase text-gray-500">{product.Marca}</span>
            <h3 className="text-md font-semibold text-gray-800 truncate mt-1" title={product.Nombre}>{product.Nombre}</h3>
            {/* --- CALIFICACIÓN REAL --- */}
            <div className="flex items-center my-2">
                <StarRating rating={rating} />
                <span className="text-xs text-gray-500 ml-2">({rating.toFixed(1)})</span>
            </div>
             <p className="text-xl font-bold text-gray-800 mb-2">{formatPrice(product.precio_unitario)}</p>
        </div>
        <div className="p-4 bg-gray-50 flex items-center justify-between">
            <button 
                onClick={() => addToCart(product, 1)} 
                disabled={isOutOfStock}
                className="flex-grow py-2 px-4 text-sm font-medium text-white bg-orange-600 rounded-md disabled:bg-gray-400 hover:bg-orange-700"
            >
                Añadir al Carrito
            </button>
            <button onClick={() => toggleCompare(product)} title="Comparar" className={`ml-2 p-2 rounded-md ${isInCompare(product.ID_Producto) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                <FaBalanceScale />
            </button>
        </div>
    </motion.div>
  );
}