// src/pages/admin/ManageProductsPage.jsx
import { useState, useEffect } from 'react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import ProductForm from '../../pages/admin/ProductForm';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAdminProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const handleSave = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.ID_Producto, productData);
      } else {
        await createProduct(productData);
      }
      setIsFormVisible(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error al guardar:", err);
      // Aquí podrías mostrar un error en el formulario
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };
  
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await deleteProduct(productId);
            fetchProducts();
        } catch (err) {
            console.error("Error al eliminar:", err);
            setError("No se pudo eliminar el producto. Puede que esté en uso en un pedido.");
        }
    }
  };
  
  const formatPrice = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Productos</h1>
        {!isFormVisible && (
            <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold">
              + Añadir Producto
            </button>
        )}
      </div>
      
      {isFormVisible ? (
        <ProductForm 
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setIsFormVisible(false)}
        />
      ) : (
        <>
        {loading ? <p>Cargando...</p> : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Img</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cant</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(p => (
                <tr key={p.ID_Producto}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{p.ID_Producto}</td>
                  <td className="px-6 py-4">
                      <img src={p.imagen_url || 'https://placehold.co/50x50/e2e8f0/64748b?text=NI'} alt={p.Nombre} className="w-12 h-12 object-cover rounded-md" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{p.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatPrice(p.precio_unitario)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(p)} className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 mr-2"><FaEdit /></button>
                    <button onClick={() => handleDelete(p.ID_Producto)} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        </>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}