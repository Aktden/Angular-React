import { useEffect, useRef } from 'react';

export function usePrevious(value) {
  const previousRef = useRef();

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return previousRef.current;
}
