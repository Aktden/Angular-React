import { useEffect, useState } from 'react';

function getInitialValue(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue;
}

/**
 * Хранит React-состояние в localStorage.
 * Чтение выполняется лениво, а ошибки чтения/записи не ломают приложение.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return getInitialValue(initialValue);

      const savedValue = window.localStorage.getItem(key);
      return savedValue !== null
        ? JSON.parse(savedValue)
        : getInitialValue(initialValue);
    } catch (error) {
      console.warn(`useLocalStorage: не удалось прочитать ключ "${key}"`, error);
      return getInitialValue(initialValue);
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`useLocalStorage: не удалось сохранить ключ "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
