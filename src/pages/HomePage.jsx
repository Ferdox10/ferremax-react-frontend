import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { Wrench, Cog, Zap, Shield, Ruler, HardHat, Leaf, Sprout } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { Button } from '@/components/ui/button';

// Objeto para estilizar cada marca con los nuevos iconos de Lucide
const brandStyles = {
    'DeWALT': { icon: <Zap />, color: 'text-orange-500 bg-orange-100' },
    'MaxForce 800W': { icon: <Wrench />, color: 'text-teal-500 bg-teal-100' },
    'Marca Titan Tools': { icon: <Shield />, color: 'text-red-500 bg-red-100' },
    'Marca PowerMaster': { icon: <Ruler />, color: 'text-purple-500 bg-purple-100' },
    'Ferremax Tools': { icon: <Cog />, color: 'text-green-500 bg-green-100' },
    'SYLVANIA': { icon: <Leaf />, color: 'text-lime-500 bg-lime-100' },
    'e4u': { icon: <HardHat />, color: 'text-blue-500 bg-blue-100'},
    'Default': { icon: <Sprout />, color: 'text-gray-500 bg-gray-100' }
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Obtenemos los productos destacados (primeros 4)
  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  // Obtenemos las marcas únicas para usarlas como categorías
  const categoriesByBrand = useMemo(() => {
    const brands = [...new Set(products.map(p => p.Marca))];
    return brands;
  }, [products]);

  return (
    <PageTransition>
      <div className="space-y-16">
        {/* --- BANNER HERO CON DISEÑO FINAL --- */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-green-700 text-white rounded-lg shadow-2xl text-center overflow-hidden">
          {/* Iconos de fondo decorativos */}
          <Wrench className="absolute top-1/4 left-10 h-32 w-32 text-white/5 transform -rotate-12 opacity-50" strokeWidth={1} />
          <Cog className="absolute bottom-1/4 right-10 h-32 w-32 text-white/5 transform rotate-12 opacity-50" strokeWidth={1} />

          <div className="relative z-10 py-20 px-6">
              <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg leading-tight">
                  Tu Ferretería
                  <br />
                  <span className="text-yellow-300">de Confianza</span>
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
                  Encuentra las mejores herramientas y equipos para todos tus proyectos.
                  <br />
                  Calidad garantizada y precios competitivos.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="bg-white text-orange-600 font-bold hover:bg-orange-100 text-base shadow-lg transition-transform hover:scale-105">
                      <Link to="/products">
                          Ver Productos <span className="ml-2">→</span>
                      </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white text-white font-bold hover:bg-white/20 text-base shadow-lg transition-transform hover:scale-105">
                      <Link to="/contact">
                          Conocer Más
                      </Link>
                  </Button>
              </div>
          </div>
        </div>

        {/* --- Sección de Categorías por Marca (NUEVO DISEÑO) --- */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-2">Nuestras Categorías</h2>
          <p className="text-center text-gray-600 mb-8">Explora nuestra amplia gama de productos organizados por categorías</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesByBrand.map(brand => {
              const style = brandStyles[brand] || brandStyles['Default'];
              return (
                <Link key={brand} to={`/products?category=${encodeURIComponent(brand)}`} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${style.color}`}>
                      <div className="text-3xl">{style.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{brand}</h3>
                    <p className="text-sm text-gray-500 mt-1">Productos de la marca {brand}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* --- Productos Destacados (sin cambios) --- */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.ID_Producto} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}