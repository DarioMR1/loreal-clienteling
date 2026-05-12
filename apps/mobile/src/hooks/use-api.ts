import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Generic hook for API calls with loading/error state.
 * Automatically fetches on mount and provides a refetch function.
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetcher();
      if (mountedRef.current) {
        setState({ data, isLoading: false, error: null });
      }
    } catch (err) {
      if (mountedRef.current) {
        const message =
          err instanceof ApiError
            ? `Error ${err.status}: ${err.statusText}`
            : err instanceof Error
              ? err.message
              : "Error desconocido";
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => {
      mountedRef.current = false;
    };
  }, [execute]);

  return { ...state, refetch: execute };
}

/**
 * Hook for lazy API calls (triggered manually, not on mount).
 */
export function useMutation<TInput, TResult>(
  mutationFn: (input: TInput) => Promise<TResult>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (input: TInput): Promise<TResult | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(input);
        setIsLoading(false);
        return result;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `Error ${err.status}: ${err.statusText}`
            : err instanceof Error
              ? err.message
              : "Error desconocido";
        setError(message);
        setIsLoading(false);
        return null;
      }
    },
    [mutationFn]
  );

  return { mutate, isLoading, error };
}
