import { useState, useEffect, useMemo } from 'react';
import { getAdminMessages, sendAdminReply, updateMessageStatus, starMessage, deleteMessage } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Mail, Inbox, Star, Archive, Trash2 } from 'lucide-react';

export default function ManageMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('inbox'); // Estado inicial ahora es 'inbox'
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyBody, setReplyBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await getAdminMessages();
            if (response.data.success) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    // Lógica de actualización de estado local para una respuesta instantánea en la UI
    const updateLocalMessage = (id, updates) => {
        setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'read' ? 'unread' : 'read';
        updateLocalMessage(id, { status: newStatus });
        await updateMessageStatus(id, newStatus);
    };

    const handleStar = async (id, currentIsStarred) => {
        const newIsStarred = !currentIsStarred;
        updateLocalMessage(id, { is_starred: newIsStarred });
        await starMessage(id, newIsStarred);
    };
    
    const handleArchive = async (id) => {
        updateLocalMessage(id, { status: 'archived' });
        await updateMessageStatus(id, 'archived');
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje permanentemente?')) {
            setMessages(prev => prev.filter(msg => msg.id !== id));
            await deleteMessage(id);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyBody.trim() || !replyingTo) return;
        setIsSubmitting(true);
        try {
            await sendAdminReply({
                recipientEmail: replyingTo.email,
                subject: replyingTo.subject || 'Respuesta a tu consulta en Ferremax',
                body: replyBody,
            });
            alert('Respuesta enviada con éxito');
            setReplyingTo(null);
        } catch (err) {
            alert('Error al enviar la respuesta.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredMessages = useMemo(() => {
        switch (filter) {
            case 'inbox':
                return messages.filter(m => m.status === 'read' || m.status === 'unread');
            case 'unread':
                return messages.filter(m => m.status === 'unread');
            case 'starred':
                return messages.filter(m => m.is_starred && m.status !== 'archived');
            case 'archived':
                return messages.filter(m => m.status === 'archived');
            default:
                return messages;
        }
    }, [messages, filter]);

    if (loading) return <p className="text-center p-10">Cargando bandeja de entrada...</p>;

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar de Filtros */}
            <nav className="w-full md:w-1/5 space-y-2">
                <Button onClick={() => setFilter('inbox')} variant={filter === 'inbox' ? 'secondary' : 'ghost'} className="w-full justify-start"><Inbox className="mr-2 h-4 w-4"/> Bandeja de Entrada</Button>
                <Button onClick={() => setFilter('unread')} variant={filter === 'unread' ? 'secondary' : 'ghost'} className="w-full justify-start"><Mail className="mr-2 h-4 w-4"/> No Leídos</Button>
                <Button onClick={() => setFilter('starred')} variant={filter === 'starred' ? 'secondary' : 'ghost'} className="w-full justify-start"><Star className="mr-2 h-4 w-4"/> Destacados</Button>
                <Button onClick={() => setFilter('archived')} variant={filter === 'archived' ? 'secondary' : 'ghost'} className="w-full justify-start"><Archive className="mr-2 h-4 w-4"/> Archivados</Button>
            </nav>

            {/* Lista de Mensajes */}
            <main className="w-full md:w-4/5">
                <h1 className="text-3xl font-bold mb-6">
                    {
                        filter === 'inbox' ? 'Bandeja de Entrada' :
                        filter === 'unread' ? 'Mensajes No Leídos' :
                        filter === 'starred' ? 'Mensajes Destacados' :
                        'Mensajes Archivados'
                    }
                </h1>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {filteredMessages.length > 0 ? filteredMessages.map(msg => (
                            <div key={msg.id} className={`p-4 transition-colors ${msg.status === 'unread' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleStar(msg.id, msg.is_starred)}><Star size={16} className={msg.is_starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}/></button>
                                            <p className="font-semibold">{msg.name} <span className="font-normal text-gray-500">&lt;{msg.email}&gt;</span></p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 mt-1">Asunto: {msg.subject || '(Sin asunto)'}</p>
                                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <p className="text-xs text-gray-400 whitespace-nowrap">{new Date(msg.created_at).toLocaleString('es-CO')}</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => setReplyingTo(msg)}>Responder</Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(msg.id, msg.status)}>{msg.status === 'read' ? 'Marcar no leído' : 'Marcar leído'}</Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleArchive(msg.id)}><Archive size={16}/></Button>
                                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(msg.id)}><Trash2 size={16}/></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="p-6 text-center text-gray-500">No hay mensajes en esta vista.</p>
                        )}
                    </div>
                </div>
            </main>
            {/* Modal para Responder (se mantiene igual) */}
            <Dialog open={!!replyingTo} onOpenChange={(isOpen) => !isOpen && setReplyingTo(null)}>
                <DialogContent className="sm:max-w-[525px] bg-white shadow-2xl">
                    <DialogHeader>
                        <DialogTitle>Responder a: {replyingTo?.name}</DialogTitle>
                        <DialogDescription>
                            Enviando respuesta a: {replyingTo?.email}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reply-body" className="text-right">
                                Tu Respuesta
                            </Label>
                            <Textarea 
                                id="reply-body" 
                                value={replyBody} 
                                onChange={(e) => setReplyBody(e.target.value)} 
                                className="col-span-3"
                                rows={10}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleReplySubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
