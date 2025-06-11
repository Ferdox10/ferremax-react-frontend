// src/components/product/SuggestedProducts.jsx
import { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from './ProductCard';

export default function SuggestedProducts({ currentCartIds }) {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await getProducts();
                // Filtra los productos que NO están en el carrito y toma 4 al azar
                const filtered = response.data
                    .filter(p => !currentCartIds.includes(p.ID_Producto))
                    .sort(() => 0.5 - Math.random()) // Mezclar aleatoriamente
                    .slice(0, 4);
                setSuggestions(filtered);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        fetchSuggestions();
    }, [currentCartIds]);

    if (suggestions.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">También te podría interesar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {suggestions.map(product => (
                    <ProductCard key={product.ID_Producto} product={product} />
                ))}
            </div>
        </div>
    );
}