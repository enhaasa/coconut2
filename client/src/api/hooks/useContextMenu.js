import React, { useState, useCallback, useEffect } from 'react';

export default function useContextMenu() {
    const [ posX, setPosX ] = useState(0);
    const [ posY, setPosY ] = useState(0);
    const [ content, setContent ] = useState(null);
    const [ title, setTitle ] = useState(null);

    const handleContextMenu = useCallback((event, newContent, newTitle) => {
        event.preventDefault();

        const { clientX, clientY } = event; // Mouse coordinates
        setPosX(clientX);
        setPosY(clientY);
        setContent(newContent);
        setTitle(newTitle);
    }, []);

    const hideContextMenu = useCallback(() => {
        setContent(null);
    }, []);

    useEffect(() => {
        function handleGlobalClick() {
            hideContextMenu();
        };

        if (content) {
            document.addEventListener('click', handleGlobalClick);
        }

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [content, hideContextMenu]);

    return [
        {
            content,
            title,
            posX,
            posY,
        },
        handleContextMenu,
        hideContextMenu,
    ]
};