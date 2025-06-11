// src/components/common/AiAssistantWidget.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from 'react-router-dom';

// --- COMPONENTE DE MENSAJE CON PARSEO MANUAL ---
const ChatMessage = ({ text, sender }) => {
    const isUser = sender === 'user';

    // Función para parsear el texto y encontrar enlaces en formato [texto](url)
    const parseTextWithLinks = (inputText) => {
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g; // Expresión regular para encontrar [texto](url)
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(inputText)) !== null) {
            // Añadir el texto que viene ANTES del enlace
            if (match.index > lastIndex) {
                parts.push(inputText.substring(lastIndex, match.index));
            }
            // Añadir el componente Link de React Router
            const linkText = match[1];
            const linkUrl = match[2];
            parts.push(
                <Link to={linkUrl} key={match.index} className="text-orange-500 font-semibold underline hover:text-orange-600">
                    {linkText}
                </Link>
            );
            lastIndex = regex.lastIndex;
        }

        // Añadir el texto que viene DESPUÉS del último enlace
        if (lastIndex < inputText.length) {
            parts.push(inputText.substring(lastIndex));
        }

        return parts;
    };

    return (
        <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${isUser ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
            >
                <p className="text-sm whitespace-pre-wrap">
                    {parseTextWithLinks(text)}
                </p>
            </motion.div>
        </div>
    );
};

export default function AiAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: '¡Hola! Soy tu asistente Ferremax. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll al final del chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = { sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai-assistant/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text }),
            });

            if (!response.ok) {
                throw new Error('La respuesta del servidor no fue exitosa.');
            }

            const data = await response.json();
            const botMessage = { sender: 'bot', text: data.reply || "Lo siento, no pude procesar tu solicitud." };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            const errorMessage = { sender: 'bot', text: "Hubo un error de conexión. Por favor, intenta más tarde." };
            setMessages(prev => [...prev, errorMessage]);
            console.error("Error al contactar al asistente IA:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Burbuja para abrir el chat */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors focus:outline-none"
                    >
                        <Bot size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Ventana del Chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="absolute bottom-0 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200"
                    >
                        {/* Header del Chat */}
                        <div className="bg-orange-500 text-white p-3 rounded-t-xl flex justify-between items-center">
                            <h3 className="font-semibold">Asistente Ferremax IA</h3>
                            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cuerpo de Mensajes */}
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
                            {messages.map((msg, index) => (
                                <ChatMessage key={index} text={msg.text} sender={msg.sender} />
                            ))}
                            {isLoading && <ChatMessage text="..." sender="bot" />}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input del Chat */}
                        <div className="p-3 border-t border-gray-200 bg-white relative">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu pregunta..."
                                disabled={isLoading}
                                className="w-full pr-12 rounded-lg resize-none"
                                rows={1}
                            />
                            <Button 
                                onClick={handleSend} 
                                disabled={isLoading || input.trim() === ''}
                                size="icon"
                                className="absolute right-4 bottom-4"
                            >
                                <Send size={16} />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}