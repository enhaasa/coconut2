import { useState } from 'react';
import useSocketListener from '../useSocketListener';

export default function usePendingRequests(init, props) {
    const { socket } = props;

    const [ pendingRequestIDs, setPendingRequestIDs] = useState(init);

    const eventHandlers = {
        getRequestConfirmation: (ID) => {
            setPendingRequestIDs(prev => (
                prev.filter(pri => pri !== ID)
            ));
        }
    }

    useSocketListener(socket, eventHandlers);

    function add(ID) {
        setPendingRequestIDs(prev => [...prev, ID]);
    }

    return {
        get: pendingRequestIDs,
        add,
    }
}