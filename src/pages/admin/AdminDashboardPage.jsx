// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import { getSalesOverview, getProductViews } from '../../services/api';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { FaDollarSign, FaShoppingCart, FaUsers, FaEye } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const StatCard = ({ icon, title, value, color }) => (
  <div className={`p-4 bg-white rounded-lg shadow-md flex items-center space-x-4`}>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [salesRes, viewsRes] = await Promise.all([
                    getSalesOverview(),
                    getProductViews()
                ]);
                setStats({
                    sales: salesRes.data,
                    views: viewsRes.data.views || [],
                });
            } catch (err) {
                setError('No se pudieron cargar las estadísticas.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !stats) return <p>Cargando dashboard...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const totalSales = stats.sales.dailySales.reduce((acc, day) => acc + day.total_ventas, 0);
    const totalViews = stats.views.reduce((acc, view) => acc + view.total_vistas, 0);

    const salesChartData = {
      labels: stats.sales.dailySales.map(d => new Date(d.dia).toLocaleDateString('es-CO', {day: '2-digit', month: 'short'})),
      datasets: [{
        label: 'Ventas Diarias',
        data: stats.sales.dailySales.map(d => d.total_ventas),
        borderColor: '#ea580c',
        backgroundColor: 'rgba(234, 88, 12, 0.2)',
        fill: true,
        tension: 0.1,
      }],
    };
    
    const topProductsChartData = {
      labels: stats.sales.topProducts.map(p => p.Nombre),
      datasets: [{
        label: 'Unidades Vendidas',
        data: stats.sales.topProducts.map(p => p.total_vendido),
        backgroundColor: '#047857',
      }],
    };

    return (
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
        
        {/* --- Tarjetas de Estadísticas --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaDollarSign className="text-white text-2xl"/>} title="Ventas Totales (30 días)" value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalSales)} color="bg-green-500" />
          <StatCard icon={<FaShoppingCart className="text-white text-2xl"/>} title="Top Producto Vendido" value={stats.sales.topProducts[0]?.Nombre || 'N/A'} color="bg-blue-500" />
          <StatCard icon={<FaEye className="text-white text-2xl"/>} title="Total de Vistas" value={totalViews.toLocaleString('es-CO')} color="bg-purple-500" />
          <StatCard icon={<FaUsers className="text-white text-2xl"/>} title="Usuarios (Próximamente)" value="N/A" color="bg-yellow-500" />
        </div>

        {/* --- Gráficas --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Ventas en los últimos 30 días</h2>
            <Line data={salesChartData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
             <h2 className="text-xl font-semibold mb-2">Top 10 Productos Vendidos</h2>
             <Bar data={topProductsChartData} options={{ indexAxis: 'y' }} />
          </div>
        </div>
      </div>
    );
}