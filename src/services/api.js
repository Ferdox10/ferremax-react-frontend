// src/services/api.js
import axios from 'axios';

// La URL de tu backend se obtiene de las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el header de admin si es necesario
apiClient.interceptors.request.use((config) => {
  // Para las rutas de admin, simulamos el header que tu backend espera.
  // En un futuro, aquí iría un token de autenticación (JWT).
  if (config.url.includes('/api/admin/')) {
    config.headers['x-admin-simulated'] = 'true';
  }
  return config;
});

// --- Funciones públicas ---
export const getProducts = () => apiClient.get('/api/productos');
export const getProductById = (id) => apiClient.get(`/api/productos/${id}`);
export const loginUser = (credentials) => apiClient.post('/login', credentials);
export const registerUser = (userData) => apiClient.post('/register', userData);
export const sendContactMessage = (messageData) => apiClient.post('/api/contact', messageData);
export const getFeaturedProducts = () => apiClient.get('/api/products/featured');

// --- Funciones de Admin ---
export const getAdminProducts = () => apiClient.get('/api/admin/products');
export const createProduct = (productData) => apiClient.post('/api/admin/products', productData);
export const updateProduct = (id, productData) => apiClient.put(`/api/admin/products/${id}`, productData);
export const deleteProduct = (id) => apiClient.delete(`/api/admin/products/${id}`);
export const getAdminOrders = () => apiClient.get('/api/admin/orders');
export const updateOrderStatus = (orderId, newStatus) => apiClient.put(`/api/admin/orders/${orderId}/status`, { nuevoEstado: newStatus });
export const getAdminOrderById = (id) => apiClient.get(`/api/admin/orders/${id}`);
export const getAdminUsers = () => apiClient.get('/api/admin/users');
export const getAdminSettings = () => apiClient.get('/api/admin/settings');
export const updateAdminSettings = (settingsData) => apiClient.put('/api/admin/settings', settingsData);
export const getAdminMessages = () => apiClient.get('/api/admin/messages');
export const sendAdminReply = (replyData) => apiClient.post('/api/admin/reply-message', replyData);
export const updateMessageStatus = (id, status) => apiClient.patch(`/api/admin/messages/${id}/status`, { status });
export const starMessage = (id, is_starred) => apiClient.patch(`/api/admin/messages/${id}/star`, { is_starred });
export const deleteMessage = (id) => apiClient.delete(`/api/admin/messages/${id}`);
export const updateUserRole = (id, role) => apiClient.patch(`/api/admin/users/${id}/role`, { role });
export const deleteUser = (id) => apiClient.delete(`/api/admin/users/${id}`);

// --- Funciones de Analíticas ---
export const getSalesOverview = () => apiClient.get('/api/admin/analytics/sales-overview');
export const getProductViews = () => apiClient.get('/api/admin/analytics/product-views');

// --- Funciones de Checkout ---
export const createWompiTempOrder = (orderData) => apiClient.post('/api/wompi/temp-order', orderData);
export const createCashOnDeliveryOrder = (orderData) => apiClient.post('/api/orders/cash-on-delivery', orderData);

// --- Nueva función para obtener configuración ---
export const getFrontendConfig = () => apiClient.get('/api/config');

// --- Funciones de Reseñas ---
export const getReviewsByProductId = (productId) => apiClient.get(`/api/products/${productId}/reviews`);
export const postReview = (productId, reviewData) => apiClient.post(`/api/products/${productId}/reviews`, reviewData);

// --- Funciones de Políticas y FAQ ---
export const getPolicies = () => apiClient.get('/api/content/policies');
export const getFaqs = () => apiClient.get('/api/content/faq');
export const updatePolicies = (policies) => apiClient.put('/api/admin/content/policies', { policies });
export const updateFaqs = (faqs) => apiClient.put('/api/admin/content/faq', { faqs });
export const deletePolicyApi = (id) => apiClient.delete(`/api/admin/content/policies/${id}`);
export const addPolicyApi = (titulo, contenido) => apiClient.post('/api/admin/content/policies', { titulo, contenido });
export const addFaqApi = (pregunta, respuesta) => apiClient.post('/api/admin/content/faq', { pregunta, respuesta });
export const deleteFaqApi = (id) => apiClient.delete(`/api/admin/content/faq/${id}`);
export const getExchangeRate = () => apiClient.get('/api/currency/rate');

// ... puedes añadir aquí el resto de endpoints del admin (órdenes, usuarios, etc.)