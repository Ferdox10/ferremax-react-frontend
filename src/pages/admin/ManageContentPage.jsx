import { useState, useEffect } from 'react';
import { getPolicies, getFaqs, updatePolicies, updateFaqs, deletePolicyApi, addPolicyApi, addFaqApi, deleteFaqApi } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export default function ManageContentPage() {
    const [policies, setPolicies] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Recarga datos desde la API
    const fetchData = async () => {
        setLoading(true);
        try {
            const [policiesRes, faqsRes] = await Promise.all([getPolicies(), getFaqs()]);
            setPolicies(policiesRes.data.policies);
            setFaqs(faqsRes.data.faqs);
        } catch (error) {
            console.error("Error al cargar contenido", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const handlePolicyChange = (index, field, value) => {
        const newPolicies = [...policies];
        newPolicies[index][field] = value;
        setPolicies(newPolicies);
    };

    const handleFaqChange = (index, field, value) => {
        const newFaqs = [...faqs];
        newFaqs[index][field] = value;
        setFaqs(newFaqs);
    };

    // Añadir nuevos
    const addNewPolicy = () => {
        setPolicies([...policies, { id: 'new', titulo: '', contenido: '' }]);
    };
    const addNewFaq = () => {
        setFaqs([...faqs, { id: 'new', pregunta: '', respuesta: '' }]);
    };

    // Eliminar
    const deletePolicy = async (id, index) => {
        if (id !== 'new' && window.confirm('¿Seguro que quieres borrar esta política?')) {
            await deletePolicyApi(id);
            fetchData();
        } else {
            const newPolicies = [...policies];
            newPolicies.splice(index, 1);
            setPolicies(newPolicies);
        }
    };
    const deleteFaq = async (id, index) => {
        if (id !== 'new' && window.confirm('¿Seguro que quieres borrar esta pregunta?')) {
            await deleteFaqApi(id);
            fetchData();
        } else {
            const newFaqs = [...faqs];
            newFaqs.splice(index, 1);
            setFaqs(newFaqs);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await updatePolicies(policies);
            // await updateFaqs(faqs); // Habilitar cuando el endpoint del backend esté listo
            alert("¡Contenido actualizado con éxito!");
        } catch (error) {
            alert("Error al guardar los cambios.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Gestionar Contenido</h1>

            {/* Sección para editar Políticas */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Editar Políticas de la Empresa</CardTitle>
                    <Button onClick={addNewPolicy}>+ Añadir Política</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {policies.map((policy, index) => (
                        <div key={policy.id || `new-${index}`} className="relative p-4 border rounded-md space-y-2">
                             <Label>Título de la Política</Label>
                             <Input value={policy.titulo} onChange={(e) => handlePolicyChange(index, 'titulo', e.target.value)} />
                             <Label>Contenido</Label>
                             <Textarea value={policy.contenido} onChange={(e) => handlePolicyChange(index, 'contenido', e.target.value)} rows={5}/>
                             <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => deletePolicy(policy.id, index)}><Trash2 size={16}/></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Sección para editar FAQ */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Editar Preguntas Frecuentes</CardTitle>
                    <Button onClick={addNewFaq}>+ Añadir Pregunta</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                     {faqs.map((faq, index) => (
                        <div key={faq.id || `new-${index}`} className="relative p-4 border rounded-md space-y-2">
                             <Label>Pregunta</Label>
                             <Input value={faq.pregunta} onChange={(e) => handleFaqChange(index, 'pregunta', e.target.value)} />
                             <Label>Respuesta</Label>
                             <Textarea value={faq.respuesta} onChange={(e) => handleFaqChange(index, 'respuesta', e.target.value)} rows={3}/>
                             <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => deleteFaq(faq.id, index)}><Trash2 size={16}/></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar Todos los Cambios'}</Button>
            </div>
        </div>
    );
}
