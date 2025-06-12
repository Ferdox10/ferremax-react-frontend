import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css'; // Cambia la ruta al CSS correcto para react-inner-image-zoom
import { Star, Heart, Share2, Truck, ShieldCheck, Undo2, Minus, Plus } from 'lucide-react';
import copy from 'copy-to-clipboard';
import ReviewList from '../components/product/ReviewList';
import ReviewForm from '../components/product/ReviewForm';

// --- COMPONENTE StarRating DEFINIDO AQUÍ ---
const StarRating = ({ rating = 0 }) => {
    const totalStars = 5;
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, i) => (
                <Star
                    key={i}
                    className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    size={20}
                />
            ))}
        </div>
    );
};

// Componente para el modal de imagen (se mantiene igual)
const ImageModal = ({ src, onClose }) => (
    <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
        <img src={src} alt="Vista ampliada" className="max-w-[90%] max-h-[90%] object-contain" onClick={e => e.stopPropagation()} />
    </div>
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('especificaciones');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewCount, setReviewCount] = useState(0); // Para forzar recarga de la lista
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
        setMainImage(response.data.imagen_url || 'https://placehold.co/600x400');
      } catch {
        setError('No se pudo encontrar el producto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center p-10">Cargando producto...</p>;
  if (error) return <p className="text-center text-red-500 p-10">{error}</p>;
  if (!product) return <p className="text-center p-10">Producto no encontrado.</p>;

  const images = [product.imagen_url, product.imagen_url_2, product.imagen_url_3, product.imagen_url_4, product.imagen_url_5].filter(url => !!url);
  const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  const isOutOfStock = product.cantidad <= 0;
  const rating = (product.ID_Producto % 5) + 1; // Simulación

  const handleQuantity = (amount) => {
    setQuantity(prev => {
        const newValue = prev + amount;
        if (newValue < 1) return 1;
        if (newValue > product.cantidad) return product.cantidad;
        return newValue;
    });
  };
  
  const handleShare = () => {
      copy(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-orange-500">Inicio</Link> &gt; 
            <Link to="/products" className="hover:text-orange-500"> Productos</Link> &gt; 
            <Link to={`/products?category=${encodeURIComponent(product.Marca)}`} className="hover:text-orange-500"> {product.Marca}</Link> &gt;
            <span className="text-gray-700"> {product.Nombre}</span>
        </nav>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna de Imágenes */}
                <div>
                    <div className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => setIsModalOpen(true)}>
                        <InnerImageZoom src={mainImage || (images.length > 0 ? images[0] : '')} zoomSrc={mainImage || (images.length > 0 ? images[0] : '')} alt={product.Nombre} zoomType="hover"/>
                    </div>
                    {images.length > 1 && (
                        <div className="flex space-x-2 mt-4">
                            {images.map((img, index) => (
                                <img 
                                    key={index}
                                    src={img} 
                                    alt={`Miniatura ${index + 1}`}
                                    onClick={() => setMainImage(img)} 
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}
                                />
                            ))}
                        </div>
                    )}
                    {isModalOpen && <ImageModal src={mainImage || (images.length > 0 ? images[0] : '')} onClose={() => setIsModalOpen(false)} />}
                </div>

                {/* Columna de Información */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{product.Nombre}</h1>
                    <div className="flex items-center gap-4 my-2">
                        <div className="flex items-center">
                           <StarRating rating={rating} />
                           <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
                        </div>
                        <span className="text-sm text-gray-500">{product.Marca}</span>
                    </div>
                    <p className="text-gray-500 mb-4">IVA incluido</p>
                    <p className="text-gray-700 mb-6">{product.Descripcion}</p>
                    <p className="text-4xl font-bold text-gray-800 mb-4">{formatPrice(product.precio_unitario)}</p>
                    
                    <div className="flex items-center gap-2 mb-6">
                        <span className="font-semibold">Cantidad:</span>
                        <div className="flex items-center border rounded-md">
                            <button onClick={() => handleQuantity(-1)} className="p-2" disabled={quantity <= 1}><Minus size={16}/></button>
                            <span className="px-4 font-semibold">{quantity}</span>
                            <button onClick={() => handleQuantity(1)} className="p-2" disabled={quantity >= product.cantidad}><Plus size={16}/></button>
                        </div>
                        <span className="text-sm text-gray-500">({product.cantidad} disponibles)</span>
                    </div>

                    <div className="flex items-stretch gap-3">
                        <button onClick={() => addToCart(product, quantity)} disabled={isOutOfStock} className="flex-1 py-3 px-6 text-white bg-orange-600 rounded-md font-semibold hover:bg-orange-700 disabled:bg-gray-400">
                            Agregar al Carrito
                        </button>
                        <button onClick={() => toggleFavorite(product.ID_Producto)} className={`p-3 border rounded-md ${isFavorite(product.ID_Producto) ? 'bg-red-100 border-red-500 text-red-500' : 'hover:bg-gray-100'}`}>
                            <Heart />
                        </button>
                        <button onClick={handleShare} className="p-3 border rounded-md hover:bg-gray-100">
                            <Share2 />
                        </button>
                    </div>

                     <div className="grid grid-cols-3 gap-4 text-center mt-8 text-sm text-gray-600">
                        <div className="flex flex-col items-center"><Truck className="mb-1"/> Envío rápido</div>
                        <div className="flex flex-col items-center"><ShieldCheck className="mb-1"/> Garantía incluida</div>
                        <div className="flex flex-col items-center"><Undo2 className="mb-1"/> Devolución fácil</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Pestañas de Información Adicional */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mt-8">
            <div className="border-b mb-4">
                <nav className="flex space-x-6">
                    <button onClick={() => setActiveTab('especificaciones')} className={`pb-2 font-semibold ${activeTab === 'especificaciones' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>Especificaciones</button>
                    <button onClick={() => setActiveTab('envio')} className={`pb-2 font-semibold ${activeTab === 'envio' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>Envío</button>
                    <button onClick={() => setActiveTab('reseñas')} className={`pb-2 font-semibold ${activeTab === 'reseñas' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}>Reseñas</button>
                </nav>
            </div>
            <div>
                {activeTab === 'especificaciones' && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Marca:</strong> {product.Marca}</div>
                        <div><strong>Código de Barras:</strong> {product.Codigo_Barras || 'N/A'}</div>
                        <div><strong>Stock Disponible:</strong> {product.cantidad} unidades</div>
                        <div><strong>Precio Unitario:</strong> {formatPrice(product.precio_unitario)}</div>
                    </div>
                )}
                 {activeTab === 'envio' && (
                    <div className="prose max-w-none">
                        <h4>Tiempos de Entrega</h4>
                        <p>Los envíos estándar a nivel nacional tardan entre 3 y 7 días hábiles. Recibirás un número de seguimiento una vez que tu pedido sea despachado.</p>
                        <h4>Costos de Envío</h4>
                        <p>El costo de envío se calcula durante el proceso de checkout basado en tu dirección. Ofrecemos <strong>envío gratuito</strong> en pedidos superiores a $100.000 COP.</p>
                        <h4>Transportadoras</h4>
                        <p>Trabajamos con las principales empresas de logística del país para garantizar que tu pedido llegue de forma segura y a tiempo.</p>
                    </div>
                )}
                 {activeTab === 'reseñas' && (
                    <div>
                        <ReviewList productId={product.ID_Producto} key={reviewCount} />
                        <ReviewForm productId={product.ID_Producto} onReviewSubmit={() => setReviewCount(prev => prev + 1)} />
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}