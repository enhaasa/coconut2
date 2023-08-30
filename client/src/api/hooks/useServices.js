import { useState } from 'react';
import useSocketListener from '../useSocketListener';

export default function useServices(init, props) {

    const {
        socket,
    } = props;

    const [ services, setServices ] = useState(init);
    const eventHandlers = {
        getServices: (items) => {
            setServices(items);
        },

        addService: (item) => {
            setServices(prev => ([...prev, item]));
        },
    };

    useSocketListener(socket, eventHandlers);

    function add(service, requestID) {
        socket.emit('addService', { service, requestID });
    }

    function refresh() {
        socket.emit('getServices');
    }
    
    return {
        get: services,
        add,
        refresh,
    }

}