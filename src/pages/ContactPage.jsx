// src/pages/ContactPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendContactMessage, getAdminSettings } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const InfoCard = ({ icon, title, content }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600">{content || 'No disponible'}</p>
        </div>
    </div>
);

export default function ContactPage() {
    const [contactInfo, setContactInfo] = useState({});
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await getAdminSettings();
                setContactInfo(response.data.settings || {});
            } catch (err) {
                console.error("Error fetching contact info", err);
            }
        };
        fetchContactInfo();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const response = await sendContactMessage(formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: '¡Mensaje enviado con éxito! Te responderemos pronto.' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus({ type: 'error', message: response.data.message || 'Hubo un error al enviar el mensaje.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Error de conexión.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Contacta con Nosotros</h1>
                <p className="text-lg text-gray-600 mt-2">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna de Información */}
                <div className="lg:col-span-1 space-y-6">
                    <InfoCard icon={<Mail className="text-orange-500"/>} title="Email" content={contactInfo.contactEmail} />
                    <InfoCard icon={<Phone className="text-orange-500"/>} title="Teléfono" content={contactInfo.contactPhone} />
                    <InfoCard icon={<MapPin className="text-orange-500"/>} title="Dirección" content={contactInfo.contactAddress} />
                    <InfoCard icon={<Clock className="text-orange-500"/>} title="Horario" content={contactInfo.contactHours || "Lunes a Viernes: 8:00 - 20:00"} />
                    {/* Redes sociales */}
                    {(contactInfo.socialFacebook || contactInfo.socialInstagram) && (
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start space-y-2">
                            <h3 className="font-semibold text-gray-800 mb-1">Redes Sociales</h3>
                            {contactInfo.socialFacebook && (
                                <a href={contactInfo.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.324-1.326z"/></svg>
                                    Facebook
                                </a>
                            )}
                            {contactInfo.socialInstagram && (
                                <a href={contactInfo.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline flex items-center gap-2">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608-.058-1.266-.069-1.646-.069-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308 1.266-.058 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.687.334-3.662 1.308-.974.974-1.25 2.386-1.308 3.662-.058 1.28-.07 1.688-.07 4.947s.012 3.667.07 4.947c.058 1.276.334 2.687 1.308 3.662.974.974 2.386 1.25 3.662 1.308 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.276-.058 2.687-.334 3.662-1.308.974-.974 1.25-2.386 1.308-3.662.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.947c-.058-1.276-.334-2.687-1.308-3.662-.974-.974-2.386-1.25-3.662-1.308-1.28-.058-1.688-.07-4.947-.07zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                                    Instagram
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Columna del Formulario */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
                         <h2 className="text-xl font-semibold mb-4">Envíanos un Mensaje</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Tu nombre</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Tu email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                         </div>
                         <div className="space-y-1">
                             <Label htmlFor="subject">Asunto</Label>
                             <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                         </div>
                         <div className="space-y-1">
                             <Label htmlFor="message">Escribe tu mensaje aquí...</Label>
                             <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} />
                         </div>
                         <Button type="submit" disabled={loading} className="w-full" size="lg">
                             {loading ? 'Enviando...' : 'Enviar Mensaje'}
                         </Button>
                         {status.message && (
                            <p className={`text-sm text-center pt-2 ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {status.message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </motion.div>
    );
}