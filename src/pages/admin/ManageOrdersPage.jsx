// src/pages/admin/ManageOrdersPage.jsx
import { useState, useEffect } from "react";
import { getAdminOrders, getAdminOrderById, updateOrderStatus } from "../../services/api";

const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
    const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
    const formatDate = (dateString) => new Date(dateString).toLocaleString('es-CO');
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold">Detalle Pedido #{order.ID_Pedido}</h2>
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cerrar Detalle</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="font-semibold mb-2">Información del Pedido</h3>
                    <p><strong>Fecha:</strong> {formatDate(order.Fecha_Pedido)}</p>
                    <p><strong>Cliente (Registrado):</strong> {order.Cliente_Nombre || 'No registrado'}</p>
                    <p><strong>Email (Registrado):</strong> {order.Cliente_Email || 'N/A'}</p>
                    <p><strong>Total:</strong> {formatPrice(order.Total_Pedido)}</p>
                    <p><strong>Método de Pago:</strong> {order.Metodo_Pago}</p>
                    <p><strong>Referencia Pago:</strong> {order.Referencia_Pago || '-'}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Información de Envío</h3>
                    <p><strong>Nombre:</strong> {order.Nombre_Cliente_Envio}</p>
                    <p><strong>Email:</strong> {order.Email_Cliente_Envio}</p>
                    <p><strong>Teléfono:</strong> {order.Telefono_Cliente_Envio}</p>
                    <p><strong>Departamento:</strong> {order.Departamento_Envio}</p>
                    <p><strong>Ciudad:</strong> {order.Ciudad_Envio}</p>
                    <p><strong>Dirección:</strong> {order.Direccion_Envio}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 mb-6">
                 <label className="font-semibold">Estado Actual:</label>
                 <select 
                    defaultValue={order.Estado_Pedido} 
                    onChange={(e) => onStatusChange(order.ID_Pedido, e.target.value)}
                    className="border-gray-300 rounded-md p-2"
                >
                    <option value="Pendiente de Confirmacion">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
            </div>
            <div>
                 <h3 className="font-semibold mb-2">Productos:</h3>
                 <div className="space-y-3">
                     {order.detalles.map(item => (
                         <div key={item.ID_Detalle_Pedido} className="flex items-center bg-gray-50 p-2 rounded-md">
                             <img src={item.Imagen_Producto || 'https://placehold.co/50x50'} alt={item.Nombre_Producto} className="w-12 h-12 object-cover rounded mr-4" />
                             <div>
                                 <p className="font-semibold">{item.Nombre_Producto}</p>
                                 <p className="text-sm text-gray-600">Cantidad: {item.Cantidad} x {formatPrice(item.Precio_Unitario_Compra)}</p>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default function ManageOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getAdminOrders();
            setOrders(response.data);
        } catch {
            setError('Error al cargar las órdenes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch {
            alert('No se pudo actualizar el estado de la orden.');
        }
    };

    const handleViewOrder = async (orderId) => {
        try {
            const response = await getAdminOrderById(orderId);
            setSelectedOrder(response.data);
        } catch {
            setError("Error al cargar detalles de la orden.");
        }
    };
    
    const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CO');

    if(loading) return <p>Cargando órdenes...</p>
    if(error) return <p className="text-red-500">{error}</p>

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestionar Órdenes</h1>
            
            {selectedOrder ? (
                <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={handleStatusChange} />
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order.ID_Pedido}>
                                    <td className="px-6 py-4">{order.ID_Pedido}</td>
                                    <td className="px-6 py-4">{order.Cliente_Nombre || order.Email_Cliente_Envio}</td>
                                    <td className="px-6 py-4">{formatDate(order.Fecha_Pedido)}</td>
                                    <td className="px-6 py-4">{formatPrice(order.Total_Pedido)}</td>
                                    <td className="px-6 py-4">{order.Metodo_Pago}</td>
                                    <td className="px-6 py-4">{order.Estado_Pedido}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleViewOrder(order.ID_Pedido)} className="px-3 py-1 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600">
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}