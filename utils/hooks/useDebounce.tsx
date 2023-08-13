import { useEffect, useState } from "react";

interface Params {
  value: string | null;
  delay: number;
}

export default function useDebounce({ value, delay }: Params) {
  const [debouncedValue, setDebouncedValue] = useState(value);

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
