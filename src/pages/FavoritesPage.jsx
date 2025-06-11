import { useState, useEffect, useMemo } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { getProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
    const { favorites } = useFavorites(); // IDs de los productos favoritos
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar todos los productos para poder encontrar los detalles de los favoritos
        const fetchAllProducts = async () => {
            try {
                const response = await getProducts();
                setAllProducts(response.data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // Filtramos la lista completa de productos para quedarnos solo con los favoritos
    const favoriteProducts = useMemo(() => {
        return allProducts.filter(product => favorites.includes(product.ID_Producto));
    }, [favorites, allProducts]);

    if (loading) {
        return <p className="text-center p-10">Cargando tus favoritos...</p>;
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Heart className="text-red-500" size={36} />
                <h1 className="text-3xl font-bold">Mis Productos Favoritos</h1>
            </div>

            {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favoriteProducts.map(product => (
                        <ProductCard key={product.ID_Producto} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">No tienes favoritos todavía</h2>
                    <p className="text-gray-600 mb-6">Haz clic en el corazón de los productos que te gusten para guardarlos aquí.</p>
                    <Link to="/products" className="inline-block px-6 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700">
                        Explorar Productos
                    </Link>
                </div>
            )}
        </div>
    );
}
