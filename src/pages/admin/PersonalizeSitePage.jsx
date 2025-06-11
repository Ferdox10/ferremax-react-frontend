// src/pages/admin/PersonalizeSitePage.jsx
import { useState, useEffect } from 'react';
import { getAdminSettings, updateAdminSettings } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PersonalizeSitePage() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await getAdminSettings();
                setSettings(response.data.settings || {});
            } catch (err) {
                setStatus({ type: 'error', message: 'Error al cargar la configuración.' });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', message: 'Guardando...' });
        try {
            await updateAdminSettings(settings);
            setStatus({ type: 'success', message: '¡Configuración guardada con éxito!' });
        } catch (err) {
            setStatus({ type: 'error', message: 'Error al guardar la configuración.' });
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <p>Cargando configuración...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Personalizar Sitio</h1>
            <form onSubmit={handleSave}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Información de Contacto y Redes</CardTitle>
                        <CardDescription>Esta información aparecerá en la página de Contacto y en el pie de página.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="contactEmail">Email de Contacto</Label>
                                <Input id="contactEmail" name="contactEmail" value={settings.contactEmail || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="contactPhone">Teléfono</Label>
                                <Input id="contactPhone" name="contactPhone" value={settings.contactPhone || ''} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="contactAddress">Dirección</Label>
                            <Input id="contactAddress" name="contactAddress" value={settings.contactAddress || ''} onChange={handleChange} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="contactHours">Horario de Atención</Label>
                            <Input id="contactHours" name="contactHours" value={settings.contactHours || ''} onChange={handleChange} placeholder="Ej: Lunes a Viernes: 8:00 - 20:00"/>
                        </div>
                        <div className="border-t my-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="socialFacebook">Facebook URL</Label>
                                <Input id="socialFacebook" name="socialFacebook" value={settings.socialFacebook || ''} onChange={handleChange} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="socialInstagram">Instagram URL</Label>
                                <Input id="socialInstagram" name="socialInstagram" value={settings.socialInstagram || ''} onChange={handleChange} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Aquí podrías añadir más tarjetas para otros settings (colores, textos, etc.) */}

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Todos los Cambios'}
                    </Button>
                </div>
                {status.message && <p className={`mt-4 text-sm text-center ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>}
            </form>
        </div>
    );
}