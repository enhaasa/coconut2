import { useCallback } from 'react';

function useDebounce(callback, delay) {
  const debouncedCallback = useCallback(
    (...args) => {
      let timerId;
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
  return debouncedCallback;
}

export default useDebounce;