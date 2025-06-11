import React, { useState, useEffect } from 'react';

const StarRatingFilter = ({ rating, setRating }) => {
    return (
        <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                >
                    ★
                </span>
            ))}
            {rating > 0 && <button onClick={() => setRating(0)} className="ml-2 text-xs text-gray-500">x</button>}
        </div>
    );
};

export default function ProductFilter({ currentFilters, onFilterChange, categories, allProducts }) {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [rating, setRating] = useState(0);

    const priceRange = allProducts.reduce((acc, p) => ({
        min: Math.min(acc.min, p.precio_unitario),
        max: Math.max(acc.max, p.precio_unitario)
    }), { min: Infinity, max: 0 });

    useEffect(() => {
        setMinPrice(currentFilters.minPrice || '');
        setMaxPrice(currentFilters.maxPrice || '');
        setRating(currentFilters.rating || 0);
    }, [currentFilters]);

    const handleFilter = (name, value) => {
        const newFilters = { ...currentFilters, [name]: value };
        onFilterChange(newFilters);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        if (name === 'minPrice') setMinPrice(value);
        if (name === 'maxPrice') setMaxPrice(value);
    };

    const applyPriceFilter = () => {
        handleFilter('minPrice', minPrice);
        handleFilter('maxPrice', maxPrice);
    };
    
    const clearFilters = () => {
        onFilterChange({ search: '', category: 'all', minPrice: '', maxPrice: '', rating: 0 });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-semibold">Filtros</h3>
                <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-orange-500">Limpiar</button>
            </div>
            <div className="space-y-6">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium">Buscar Productos</label>
                    <input type="text" id="search" name="search" value={currentFilters.search || ''} onChange={(e) => handleFilter('search', e.target.value)} placeholder="Buscar..." className="mt-1 w-full border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium">Categoría (Marca)</label>
                    <select id="category" name="category" value={currentFilters.category || 'all'} onChange={(e) => handleFilter('category', e.target.value)} className="mt-1 w-full border-gray-300 rounded-md">
                        <option value="all">Todas las Marcas</option>
                        {categories.filter(c => c !== 'all').map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Rango de Precios</label>
                    <div className="flex items-center space-x-2 mt-1">
                        <input type="number" name="minPrice" value={minPrice} onChange={handlePriceChange} placeholder="Mín" className="w-full border-gray-300 rounded-md"/>
                        <span>-</span>
                        <input type="number" name="maxPrice" value={maxPrice} onChange={handlePriceChange} placeholder="Máx" className="w-full border-gray-300 rounded-md"/>
                    </div>
                     <button onClick={applyPriceFilter} className="w-full mt-2 text-xs py-1 bg-gray-200 rounded">Aplicar</button>
                </div>
                <div>
                    <label className="block text-sm font-medium">Calificación Mínima</label>
                    <StarRatingFilter rating={rating} setRating={(r) => handleFilter('rating', r)} />
                </div>
            </div>
        </div>
    );
}