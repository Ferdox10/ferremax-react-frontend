// src/pages/admin/ProductStatsPage.jsx
import { useState, useEffect } from 'react';
import { getProductViews } from '../../services/api';

export default function ProductStatsPage() {
    const [views, setViews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchViews = async () => {
            try {
                const response = await getProductViews();
                // Extraemos el array 'views' del objeto de respuesta
                if (response.data.success && Array.isArray(response.data.views)) {
                    setViews(response.data.views);
                } else {
                    setError("La respuesta del servidor no contenía una lista de vistas válida.");
                }
            } catch {
                setError('No se pudieron cargar las estadísticas.');
            } finally {
                setLoading(false);
            }
        };
        fetchViews();
    }, []);

    if(loading) return <p className="text-center p-10">Cargando estadísticas...</p>;
    if(error) return <p className="text-center text-red-500 p-10">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Productos Más Vistos</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {views.length > 0 ? (
                        views.map((item, index) => (
                            <li key={item.Nombre} className="px-6 py-4 flex justify-between items-center">
                                <span className="font-medium">{index + 1}. {item.Nombre}</span>
                                <span className="text-lg font-bold text-gray-700">{item.total_vistas.toLocaleString('es-CO')} vistas</span>
                            </li>
                        ))
                    ) : (
                        <li className="px-6 py-4 text-center text-gray-500">No hay datos de vistas disponibles.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}