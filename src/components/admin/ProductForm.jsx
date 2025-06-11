import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"; // Importar de Shadcn
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialFormState = { /* ... (se mantiene igual) ... */ };

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (product) {
      setFormData({ ...initialFormState, ...product });
    } else {
      setFormData(initialFormState);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Editar Producto' : 'Añadir Nuevo Producto'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Nombre">Nombre del Producto*</Label>
              <Input id="Nombre" name="Nombre" value={formData.Nombre || ''} onChange={handleChange} required />
            </div>
            {/* ... (Repite esta estructura para Marca, Precio, Cantidad) ... */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Descripcion">Descripción</Label>
            <Textarea id="Descripcion" name="Descripcion" value={formData.Descripcion || ''} onChange={handleChange} />
          </div>

          <div className="space-y-4 pt-4 border-t">
             <h3 className="text-lg font-medium">URLs de Imágenes</h3>
             {/* ... (Repite esta estructura para las 5 URLs) ... */}
             <div className="space-y-2">
                 <Label htmlFor="imagen_url">Imagen Principal (URL 1)</Label>
                 <Input id="imagen_url" name="imagen_url" value={formData.imagen_url || ''} onChange={handleChange} />
             </div>
             {/* ... (etc. para imagen_url_2 a 5) ... */}
          </div>
          
          <div className="flex justify-end space-x-2 pt-6">
             <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
             <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}