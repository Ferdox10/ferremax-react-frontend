// src/components/admin/AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaCog } from 'react-icons/fa';

const AdminLayout = () => {
  const linkClasses = "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200";
  const activeLinkClasses = "bg-orange-100 text-orange-600 font-semibold";
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Menú Admin</h2>
          <nav className="space-y-2">
            <NavLink to="/admin/dashboard" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaTachometerAlt className="mr-3" /> Dashboard</NavLink>
            <NavLink to="/admin/products" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaBoxOpen className="mr-3" /> Productos</NavLink>
            <NavLink to="/admin/orders" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaClipboardList className="mr-3" /> Órdenes</NavLink>
            {/* Agrega más enlaces aquí a medida que crees las páginas */}
            {/* <NavLink to="/admin/users" className={...}><FaUsers className="mr-3" /> Usuarios</NavLink> */}
            {/* <NavLink to="/admin/settings" className={...}><FaCog className="mr-3" /> Configuración</NavLink> */}
          </nav>
        </div>
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        <Outlet /> {/* Aquí se renderizará el contenido de la ruta anidada */}
      </main>
    </div>
  );
};

export default AdminLayout;