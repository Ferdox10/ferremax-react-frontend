// src/hooks/useWompi.js
import { useState, useEffect } from 'react';

const WOMPI_SCRIPT_URL = "https://checkout.wompi.co/widget.js";
let isScriptLoading = false;
let loadedSubscribers = [];

export function useWompi() {
    const [isWompiReady, setIsWompiReady] = useState(!!window.WompiCheckout);
    const [wompiError, setWompiError] = useState(null);

    useEffect(() => {
        if (isWompiReady) return;

        if (isScriptLoading) {
            const subscriber = () => setIsWompiReady(true);
            loadedSubscribers.push(subscriber);
            return () => {
                loadedSubscribers = loadedSubscribers.filter(s => s !== subscriber);
            };
        }

        isScriptLoading = true;
        const script = document.createElement('script');
        script.src = WOMPI_SCRIPT_URL;
        script.async = true;

        const onLoad = () => {
            console.log("Script de Wompi cargado y listo.");
            setIsWompiReady(true);
            isScriptLoading = false;
            loadedSubscribers.forEach(subscriber => subscriber());
            loadedSubscribers = [];
        };

        const onError = () => {
            console.error("Fallo al cargar el script de Wompi.");
            setWompiError("No se pudo cargar el script de Wompi. Verifica tu conexión o intenta más tarde.");
            isScriptLoading = false;
        };

        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);

        document.body.appendChild(script);

        return () => {
            script.removeEventListener('load', onLoad);
            script.removeEventListener('error', onError);
        };
    }, [isWompiReady]);

    return { isWompiReady, wompiError };
}