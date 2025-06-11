// src/components/admin/ProductForm.jsx
import { useState, useEffect } from 'react';

const initialFormState = {
    Nombre: '', Descripcion: '', precio_unitario: '', Marca: '', cantidad: '',
    imagen_url: '', imagen_url_2: '', imagen_url_3: '', imagen_url_4: '', imagen_url_5: ''
};

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (product) {
      // Si estamos editando, llenamos el formulario.
      // Creamos un nuevo objeto basado en el estado inicial y lo sobreescribimos
      // con los datos del producto para asegurar que todos los campos (incluyendo los de imagen)
      // estén presentes y se limpien si el producto no los tiene.
      const productDataForForm = { ...initialFormState, ...product };
      setFormData(productDataForForm);
    } else {
      // Si es un producto nuevo, reseteamos al estado inicial.
      setFormData(initialFormState);
    }
  }, [product]); // Este efecto se ejecuta cada vez que el 'product' que llega como prop cambia.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 border-b pb-3">{product ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700">Nombre del Producto*</label>
              <input type="text" name="Nombre" value={formData.Nombre} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>
            {/* ... (resto de campos principales: Marca, Precio, Cantidad) ... */}
        </div>

        <div>
          <label htmlFor="Descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea name="Descripcion" rows="4" value={formData.Descripcion} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        
        <div className="space-y-3 pt-4 border-t">
           <h3 className="text-lg font-medium text-gray-800">URLs de Imágenes</h3>
            {/* Usamos un array para generar los campos y evitar repetición */}
            {[1, 2, 3, 4, 5].map(i => {
                const fieldName = i === 1 ? 'imagen_url' : `imagen_url_${i}`;
                return (
                    <div key={fieldName}>
                        <label htmlFor={fieldName} className="block text-sm font-medium text-gray-600">
                            {i === 1 ? 'Imagen Principal (URL 1)' : `Imagen ${i}`}
                        </label>
                        <input 
                            type="text" 
                            name={fieldName} 
                            id={fieldName}
                            // Usamos "|| ''" para evitar que el input sea 'uncontrolled' si el valor es null
                            value={formData[fieldName] || ''} 
                            onChange={handleChange} 
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                );
            })}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 font-semibold">Cancelar</button>
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 font-semibold">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}