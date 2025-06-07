import * as React from 'react';

type DebounceProps<T> = {
  value: T;
  delay?: number;
}

const useDebounce = <T>({ value, delay = 500 }: DebounceProps<T>) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useDebouncedState = <T,>(initial: T | undefined = undefined, delay: number = 500): [T | undefined, T | undefined, (value: T) => void] => {
  const [value, setValue] = React.useState<T | undefined>(initial);
  const [debouncedValue, setDebouncedValue] = React.useState<T | undefined>(undefined);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return [value, debouncedValue, setValue];
}

export default useDebounce;
export { useDebouncedState };
