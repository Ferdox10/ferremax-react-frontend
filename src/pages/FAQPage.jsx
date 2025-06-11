import { useState, useEffect } from 'react';
import { getFaqs } from '../services/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await getFaqs();
                setFaqs(response.data.faqs);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchFaqs();
    }, []);

    if (loading) return <p>Cargando preguntas...</p>;

    return (
        <div className="max-w-3xl mx-auto">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Preguntas Frecuentes</h1>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map(faq => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                        <AccordionTrigger className="font-semibold text-lg">{faq.pregunta}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            {faq.respuesta}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
