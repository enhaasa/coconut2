import { useState } from 'react';
import useSocketListener from '../useSocketListener';

export default function useMessages(init, props) {
    const {
        socket
    } = props;

    const [ messages, setMessages ] = useState(init);
    const eventHandlers = {
        message: (message) => {
            setMessages(prev => [...prev, message]);
        }
    }

    useSocketListener(socket, eventHandlers);

    function remove(indexToRemove) {
        setMessages(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    return { 
            get: messages,
            remove
        }
    
}