import { useState, useEffect } from 'react';

//  Su propósito es mejorar el rendimiento, especialmente en la barra de búsqueda.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);


    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}