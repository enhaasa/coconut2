import { useEffect } from "react";

const useSocketListener = (socket, eventHandlers) => {
  useEffect(() => {
    if (socket) {
      const addEventListeners = () => {
        Object.keys(eventHandlers).forEach((eventName) => {
          socket.on(eventName, eventHandlers[eventName]);
        });
      };

      const removeEventListeners = () => {
        Object.keys(eventHandlers).forEach((eventName) => {
          socket.off(eventName, eventHandlers[eventName]);
        });
      };

      addEventListeners();

      return () => {
        removeEventListeners();
      };
    }
  }, [socket, eventHandlers]);
};

export default useSocketListener;