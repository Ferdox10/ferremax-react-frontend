import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useCompare } from '../../hooks/useCompare';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Heart, ShoppingCart, LayoutDashboard, BarChart3, Wrench, Search, Menu, X } from "lucide-react";

export default function Header() {
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const { compareItems } = useCompare();
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                // No hay menú manual que cerrar
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuRef]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${searchTerm.trim()}`);
            setSearchTerm('');
            setIsMobileMenuOpen(false);
        }
    };
    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="bg-white shadow-sm py-2 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo Clickeable */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="p-2 bg-orange-500 rounded-md">
                        <Wrench className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">Ferremax</span>
                </Link>

                {/* Buscador Central (visible en pantallas medianas y grandes) */}
                <div className="flex-1 max-w-xl mx-4 hidden lg:block">
                    <form onSubmit={handleSearch} className="relative">
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar productos..." className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
                        <button type="submit" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"><Search size={20} /></button>
                    </form>
                </div>

                {/* Navegación y Acciones (el contenedor principal) */}
                <div className="flex items-center space-x-4">
                    {/* Enlaces de Navegación para Escritorio (ocultos en móvil) */}
                    <nav className="hidden md:flex items-center space-x-6 text-gray-600 font-medium">
                        <NavLink to="/" className={({isActive}) => `transition ${isActive ? "text-orange-500" : "hover:text-orange-500"}`}>Inicio</NavLink>
                        <NavLink to="/products" className={({isActive}) => `transition ${isActive ? "text-orange-500" : "hover:text-orange-500"}`}>Productos</NavLink>
                        <NavLink to="/about" className={({isActive}) => `transition ${isActive ? "text-orange-500" : "hover:text-orange-500"}`}>Acerca de</NavLink>
                        <NavLink to="/contact" className={({isActive}) => `transition ${isActive ? "text-orange-500" : "hover:text-orange-500"}`}>Contacto</NavLink>
                        <NavLink to="/policies" className={({isActive}) => `transition ${isActive ? "text-orange-500" : "hover:text-orange-500"}`}>Políticas</NavLink>
                        <NavLink to="/faq" className={({isActive}) => `transition ${isActive ? "text-orange-500" : "hover:text-orange-500"}`}>FAQ</NavLink>
                    </nav>

                    {/* Iconos (siempre visibles) */}
                    <div className="flex items-center space-x-4">
                        <Link to="/compare" title="Comparar Productos" className="relative text-gray-600 hover:text-orange-500">
                            <BarChart3 className="h-6 w-6" />
                            {compareItems.length > 0 && <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-blue-500 rounded-full">{compareItems.length}</span>}
                        </Link>
                        <Link to="/cart" title="Carrito de Compras" className="relative text-gray-600 hover:text-orange-500">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-orange-600 rounded-full">{cartCount}</span>}
                        </Link>
                    </div>

                    {/* Menú de Usuario (siempre visible, el dropdown se controla con estado) */}
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                                    <div className="h-full w-full rounded-full bg-gradient-to-r from-orange-500 to-green-600 flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                className="w-56 bg-white shadow-lg ring-1 ring-black ring-opacity-5" 
                                align="end" 
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1 p-2">
                                        <p className="text-sm font-medium leading-none">{user.username}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {isAdmin && (
                                  <DropdownMenuItem asChild>
                                    <Link to="/admin/dashboard" className="cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span>
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link to="/favorites" className="cursor-pointer">
                                        <Heart className="mr-2 h-4 w-4" /><span>Favoritos</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:block">
                            <Button asChild><Link to="/login">Iniciar Sesión</Link></Button>
                        </div>
                    )}

                    {/* Botón de Hamburguesa (solo visible en móvil) */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel del Menú Móvil Desplegable */}
            {isMobileMenuOpen && (
                 <div className="md:hidden bg-white border-t">
                     <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         <form onSubmit={handleSearch} className="w-full relative mb-2">
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar productos..." className="w-full pl-10 pr-4 py-2 border rounded-full"/>
                            <button type="submit" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"><Search /></button>
                         </form>
                         <NavLink to="/" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Inicio</NavLink>
                         <NavLink to="/products" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Productos</NavLink>
                         <NavLink to="/about" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Acerca de</NavLink>
                         <NavLink to="/contact" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Contacto</NavLink>
                         <NavLink to="/policies" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Políticas</NavLink>
                         <NavLink to="/faq" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Preguntas Frecuentes</NavLink>
                         <div className="border-t my-2"></div>
                         {!isAuthenticated && <NavLink to="/login" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Iniciar Sesión</NavLink>}
                     </div>
                 </div>
            )}
        </header>
    );
}