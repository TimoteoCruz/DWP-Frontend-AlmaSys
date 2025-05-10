import { useState, useEffect, useRef } from 'react';

export const useLongPolling = (fetchFunction, {
  interval = 500, // Intervalo más corto para mayor reactividad
  enabled = true,
  immediate = true, // Siempre ejecutar inmediatamente
  onSuccess = () => {},
  onError = () => {},
} = {}) => {
  const [data, setData] = useState(null);
  const pollingRef = useRef(null);
  const isPolling = useRef(false);

  const startPolling = () => {
    if (!enabled || isPolling.current) return;

    const poll = async () => {
      if (!enabled) return;
      
      isPolling.current = true;
      try {
        const result = await fetchFunction();
        
        // Solo actualizar si hay cambios reales
        if (!result?.noChange) {
          setData(result);
          onSuccess(result);
        }
      } catch (error) {
        console.error('Error en polling:', error);
        onError(error);
      } finally {
        isPolling.current = false;
        // Programar la próxima ejecución
        if (enabled) {
          pollingRef.current = setTimeout(poll, interval);
        }
      }
    };

    if (immediate) {
      poll();
    } else {
      pollingRef.current = setTimeout(poll, interval);
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    isPolling.current = false;
  };

  // Reiniciar polling cuando cambian las dependencias
  useEffect(() => {
    stopPolling();
    startPolling();
    return () => stopPolling();
  }, [enabled, interval, immediate]);

  return { data, startPolling, stopPolling };
};
