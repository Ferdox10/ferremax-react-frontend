import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaChartBar, FaPaintBrush, FaChartPie } from 'react-icons/fa';
import { Mail, FileText } from 'lucide-react';

const AdminLayout = () => {
  const linkClasses = "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200";
  const activeLinkClasses = "bg-orange-100 text-orange-600 font-semibold";
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Admin</h2>
          <nav className="space-y-2">
            <NavLink to="/admin/dashboard" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaTachometerAlt className="mr-3" /> Dashboard</NavLink>
            <NavLink to="/admin/products" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaBoxOpen className="mr-3" /> Gestionar Productos</NavLink>
            <NavLink to="/admin/orders" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaClipboardList className="mr-3" /> Pedidos</NavLink>
            <NavLink to="/admin/customers" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaUsers className="mr-3" /> Clientes</NavLink>
            <NavLink to="/admin/product-stats" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaChartBar className="mr-3" /> Estadísticas Prod.</NavLink>
            <NavLink to="/admin/analytics" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaChartPie className="mr-3" /> Analíticas</NavLink>
            <NavLink to="/admin/personalize" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FaPaintBrush className="mr-3" /> Personalizar Sitio</NavLink>
            <NavLink to="/admin/messages" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><Mail className="mr-3" /> Mensajes</NavLink>
            <NavLink to="/admin/content" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}><FileText className="mr-3" /> Gestionar Contenido</NavLink>
          </nav>
        </div>
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;