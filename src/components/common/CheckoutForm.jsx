// src/components/common/CheckoutForm.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutForm({ onSubmit, submitText = "Continuar al Pago" }) {
    const { user } = useAuth();

    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        complement: '', // Opcional
        city: '',
        department: '',
        postalCode: '', // Opcional
        phone: '',
    });

    // Llenar el formulario con los datos del usuario si está logueado
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.username || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Juan Pérez" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="email">Correo electrónico *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="tu@email.com" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Ej. Calle 123 #45-67" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="complement">Complemento (Opcional)</Label>
                    <Input id="complement" name="complement" value={formData.complement} onChange={handleChange} placeholder="Ej. Apto 101, Torre 2" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Ej. Bogotá" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="department">Departamento *</Label>
                    <Input id="department" name="department" value={formData.department} onChange={handleChange} required placeholder="Ej. Cundinamarca" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label htmlFor="postalCode">Código Postal (Opcional)</Label>
                    <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Ej. 110111" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="Ej. 3101234567" />
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full" size="lg">
                    {submitText}
                </Button>
            </div>
        </form>
    );
}