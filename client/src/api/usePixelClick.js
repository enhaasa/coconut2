import React, { useCallback } from 'react';

export default function usePixelClick() {
  const handleClick = useCallback((event) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    return [x, y];
  }, []);

  return handleClick;
};
