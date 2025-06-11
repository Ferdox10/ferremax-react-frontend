// src/pages/ComparePage.jsx
import React from 'react';
import { useCompare } from '../hooks/useCompare';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import PageTransition from '../components/common/PageTransition';

export default function ComparePage() {
    const { compareItems, clearCompare, toggleCompare } = useCompare();
    const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);

    if (compareItems.length === 0) {
        return (
            <div className="text-center py-10">
                <h1 className="text-3xl font-bold mb-4">No hay productos para comparar</h1>
                <p className="mb-6">Añade productos desde el catálogo para verlos aquí.</p>
                <Link to="/products" className="px-6 py-3 bg-orange-600 text-white rounded-md">Ir a Productos</Link>
            </div>
        );
    }
    
    // Crear una lista de todas las propiedades posibles para las filas
    const properties = ['Precio', 'Marca', 'Disponibilidad', 'Descripción'];

    return (
        <PageTransition>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-3xl font-bold">Comparador de Productos</h1>
                    <button onClick={clearCompare} className="px-4 py-2 bg-red-100 text-red-600 rounded-md font-semibold">Limpiar Todo</button>
                </div>
                <div className="overflow-x-auto">
                    <div className="flex space-x-4">
                        {/* Columna de etiquetas de propiedades */}
                        <div className="w-32 flex-shrink-0">
                             <div className="h-48"></div> {/* Espacio para imagen */}
                             {properties.map(prop => <div key={prop} className="h-16 flex items-center font-bold">{prop}</div>)}
                        </div>
                        {/* Columnas de productos */}
                        {compareItems.map(item => (
                            <div key={item.ID_Producto} className="w-56 flex-shrink-0 text-center border p-2 rounded-lg">
                                <div className="relative">
                                   <img src={item.imagen_url || 'https://placehold.co/150'} alt={item.Nombre} className="w-full h-40 object-contain mb-2"/>
                                   <button onClick={() => toggleCompare(item)} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"><FaTrash className="text-red-500"/></button>
                                </div>
                                <h3 className="font-semibold text-sm h-10">{item.Nombre}</h3>
                                <div className="h-16 flex items-center justify-center font-bold text-orange-600">{formatPrice(item.precio_unitario)}</div>
                                <div className="h-16 flex items-center justify-center">{item.Marca}</div>
                                <div className="h-16 flex items-center justify-center text-green-600">En Stock</div>
                                <div className="h-16 flex items-center justify-center text-xs text-gray-600 overflow-hidden">{item.Descripcion.substring(0, 50)}...</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}