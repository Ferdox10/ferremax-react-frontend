// src/pages/admin/ManageCustomersPage.jsx
import { useState, useEffect } from 'react';
import { getAdminUsers, updateUserRole, deleteUser } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function ManageCustomersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAdminUsers();
            setUsers(response.data);
        } catch {
            setError('No se pudieron cargar los clientes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
        } catch {
            alert('Error al cambiar el rol del usuario.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este usuario? Esta acción no se puede deshacer.')) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
            } catch (err) {
                alert(err.response?.data?.message || 'Error al eliminar el usuario.');
            }
        }
    };

    if (loading) return <p className="text-center p-10">Cargando clientes...</p>;
    if (error) return <p className="text-center text-red-500 p-10">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Clientes Registrados</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="border-gray-300 rounded-md p-1 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleDeleteUser(user.id)}>
                                        <Trash2 size={16}/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}