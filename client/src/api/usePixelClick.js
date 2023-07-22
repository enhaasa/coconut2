import React, { useCallback } from 'react';

const usePixelClick = () => {
  const handleClick = useCallback((event) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    console.log(`Clicked pixel coordinates: (${x}, ${y})`);
  }, []);

  return handleClick;
};

export default usePixelClick;
