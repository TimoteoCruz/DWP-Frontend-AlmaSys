"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type PollingOptions = {
  interval: number
  enabled?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  immediate?: boolean
}

export function useLongPolling<T>(fetchFn: () => Promise<T>, options: PollingOptions) {
  const { interval, enabled = true, onSuccess, onError, immediate = true } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [isPolling, setIsPolling] = useState<boolean>(enabled)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef<boolean>(true)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const isPollingRef = useRef(isPolling)
  const fetchFnRef = useRef(fetchFn)

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    isPollingRef.current = isPolling;
    fetchFnRef.current = fetchFn;
  }, [onSuccess, onError, isPolling, fetchFn]);

  const fetchData = useCallback(async () => {
    if (!isPollingRef.current || !mountedRef.current) return;

    setLoading(true);
    console.log('Iniciando polling request', new Date().toISOString());

    try {
      const result = await fetchFnRef.current();
      console.log('Polling response:', result);

      if (mountedRef.current) {
        setData(result);
        setLoading(false);
        if (onSuccessRef.current) {
          onSuccessRef.current(result);
        }
      }
    } catch (err) {
      console.error('Error en polling:', err);
      if (mountedRef.current) {
        setError(err as Error);
        setLoading(false);
        if (onErrorRef.current) {
          onErrorRef.current(err);
        }
      }
    }

    if (mountedRef.current && isPollingRef.current) {
      console.log('Programando siguiente polling en', interval, 'ms');
      timeoutRef.current = setTimeout(fetchData, interval);
    }
  }, [interval]);

  const startPolling = useCallback(() => {
    console.log('Iniciando polling');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    isPollingRef.current = true;
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    console.log('Deteniendo polling');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isPollingRef.current = false;
    setIsPolling(false);
  }, []);

  useEffect(() => {
    console.log('Estado de polling cambiado:', isPolling);
    isPollingRef.current = isPolling;
    
    if (isPolling) {
      if (immediate) {
        fetchData();
      } else {
        timeoutRef.current = setTimeout(fetchData, interval);
      }
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPolling, immediate, interval, fetchData]);

  useEffect(() => {
    console.log('Estado de enabled cambiado:', enabled);
    
    if (enabled && !isPolling) {
      setIsPolling(true);
    } else if (!enabled && isPolling) {
      stopPolling();
    }
  }, [enabled, isPolling, stopPolling]);

  useEffect(() => {
    return () => {
      console.log('Componente desmontado');
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    isPolling,
    startPolling,
    stopPolling,
    refetch: fetchData,
  };
}
