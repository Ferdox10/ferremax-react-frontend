// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { useAuth } from './hooks/useAuth';
import CheckoutPage from './pages/CheckoutPage';
import AdminLayout from './components/admin/AdminLayout'; // Importar layout
import ComparePage from './pages/ComparePage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import AiAssistantWidget from './components/common/AiAssistantWidget'; // <<< 1. Importar el widget
import FavoritesPage from './pages/FavoritesPage'; // Importar FavoritesPage
import PoliciesPage from './pages/PoliciesPage';
import FAQPage from './pages/FAQPage';

// Rutas de Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage'; // Añadir import
import ManageCustomersPage from './pages/admin/ManageCustomersPage';
import ProductStatsPage from './pages/admin/ProductStatsPage';
import PersonalizeSitePage from './pages/admin/PersonalizeSitePage';
import ManageMessagesPage from './pages/admin/ManageMessagesPage'; // Importar ManageMessagesPage
import ManageContentPage from './pages/admin/ManageContentPage'; // Importar ManageContentPage

// Componente para proteger rutas
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />; // O a una página de "no autorizado"
    }

    return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/payment-status" element={<PaymentStatusPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            
            {/* --- RUTAS DE ADMIN ANIDADAS --- */}
            <Route 
                path="/admin" 
                element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}
            >
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="products" element={<ManageProductsPage />} />
                <Route path="orders" element={<ManageOrdersPage />} />
                <Route path="customers" element={<ManageCustomersPage />} />
                <Route path="product-stats" element={<ProductStatsPage />} />
                <Route path="analytics" element={<AdminDashboardPage />} /> {/* Reutilizamos el dashboard por ahora */}
                <Route path="personalize" element={<PersonalizeSitePage />} />
                <Route path="messages" element={<ManageMessagesPage />} /> {/* Nueva ruta para mensajes */}
                <Route path="content" element={<ManageContentPage />} /> {/* Nueva ruta para gestión de contenido */}
                {/* Redirección por defecto para /admin */}
                <Route index element={<Navigate to="dashboard" replace />} /> 
            </Route>

            {/* <<< 2. AÑADIR LA NUEVA RUTA PROTEGIDA >>> */}
            <Route 
                path="/favorites" 
                element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} 
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        {/* <<< 2. Añadir el widget aquí >>> */}
        <AiAssistantWidget />
      </div>
    </Router>
  );
}

export default App;