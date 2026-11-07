import { useEffect, useState } from 'react';

// Generic-хук: T — тип хранимого значения.
// as const превращает возвращаемый массив в кортеж [T, Dispatch<SetStateAction<T>>]
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) return JSON.parse(saved) as T;
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`useLocalStorage: не удалось сохранить "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
