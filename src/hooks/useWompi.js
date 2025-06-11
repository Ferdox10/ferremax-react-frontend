// src/hooks/useWompi.js
import { useState, useEffect } from 'react';

const WOMPI_SCRIPT_URL = "https://checkout.wompi.co/widget.js";

export function useWompi() {
    const [isWompiReady, setIsWompiReady] = useState(!!window.WompiCheckout);

    useEffect(() => {
        if (window.WompiCheckout) {
            setIsWompiReady(true);
            return;
        }

        const existingScript = document.querySelector(`script[src="${WOMPI_SCRIPT_URL}"]`);
        if (existingScript) {
            const checkInterval = setInterval(() => {
                if (window.WompiCheckout) {
                    setIsWompiReady(true);
                    clearInterval(checkInterval);
                }
            }, 100);
            return () => clearInterval(checkInterval);
        }

        const script = document.createElement('script');
        script.src = WOMPI_SCRIPT_URL;
        script.async = true;

        script.onload = () => {
            console.log("Script de Wompi cargado.");
            setTimeout(() => {
                if (window.WompiCheckout) {
                    console.log("WompiCheckout está listo en window.");
                    setIsWompiReady(true);
                } else {
                    console.error("El script de Wompi se cargó, pero WompiCheckout no está definido.");
                }
            }, 100);
        };

        script.onerror = () => {
            console.error("Fallo al cargar el script de Wompi.");
        };
        
        document.body.appendChild(script);

        return () => {
            // No es necesario remover el script
        };
    }, []);

    return { isWompiReady };
}