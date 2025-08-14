import { useRef, useState } from 'react';

export const useStateRef = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const ref = useRef<T>(initialState);

  return [
    state,
    (value: T) => {
      ref.current = value;
      setState(value);
    },
    ref,
  ] as const;
};
