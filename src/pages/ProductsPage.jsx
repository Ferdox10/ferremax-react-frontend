// src/pages/ProductsPage.jsx (versión final)
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom'; // Importar
import { getProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import PageTransition from '../components/common/PageTransition';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: Number(searchParams.get('rating')) || 0,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Simular rating para el filtro
      const productRating = (product.ID_Producto % 5) + 1;
      const matchesSearch = (product.Nombre.toLowerCase().includes(filters.search.toLowerCase()) || product.Marca.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesCategory = (filters.category === 'all' || product.Marca === filters.category);
      const matchesMinPrice = (filters.minPrice === '' || product.precio_unitario >= Number(filters.minPrice));
      const matchesMaxPrice = (filters.maxPrice === '' || product.precio_unitario <= Number(filters.maxPrice));
      const matchesRating = (filters.rating === 0 || productRating >= filters.rating);
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
    });
  }, [products, filters]);
  
  const categories = useMemo(() => ['all', ...new Set(products.map(p => p.Marca))], [products]);

  const handleFilterChange = (newFilters) => {
    setSearchParams(newFilters);
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <PageTransition>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <ProductFilter
            currentFilters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
            allProducts={products}
          />
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">
          <h1 className="text-3xl font-bold mb-6">Nuestro Catálogo</h1>
          {loading ? (
             <p className="text-center">Cargando productos...</p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.ID_Producto} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-10">No se encontraron productos.</p>
          )}
        </main>
      </div>
    </PageTransition>
  );
}