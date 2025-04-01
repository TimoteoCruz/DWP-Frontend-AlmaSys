"use client"

import { useState, useEffect, useRef } from "react"

type PollingOptions = {
  interval: number
  enabled?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  immediate?: boolean
}

/**
 * Custom hook para implementar long polling
 * @param fetchFn - La función a llamar para obtener datos
 * @param options - Opciones de configuración para el polling
 * @returns Objeto con datos, estado de carga, error y funciones de control
 */
export function useLongPolling<T>(fetchFn: () => Promise<T>, options: PollingOptions) {
  const { interval, enabled = true, onSuccess, onError, immediate = true } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [isPolling, setIsPolling] = useState<boolean>(enabled)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef<boolean>(true)

  const fetchData = async () => {
    if (!isPolling || !mountedRef.current) return

    setLoading(true)
    setError(null)

    try {
      const result = await fetchFn()

      if (mountedRef.current) {
        setData(result)
        setLoading(false)
        onSuccess?.(result)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error)
        setLoading(false)
        onError?.(err)
      }
    }

    if (mountedRef.current && isPolling) {
      timeoutRef.current = setTimeout(fetchData, interval)
    }
  }

  const startPolling = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPolling(true)
  }

  const stopPolling = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsPolling(false)
  }

  useEffect(() => {
    if (isPolling && immediate) {
      fetchData()
    } else if (isPolling) {
      timeoutRef.current = setTimeout(fetchData, interval)
    }

    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPolling])

  useEffect(() => {
    if (enabled && !isPolling) {
      setIsPolling(true)
    } else if (!enabled && isPolling) {
      stopPolling()
    }
  }, [enabled])

  return {
    data,
    loading,
    error,
    isPolling,
    startPolling,
    stopPolling,
    refetch: fetchData,
  }
}

