import { useState } from 'react';
import useSocketListener from './../useSocketListener';

export default function useServiceMenu(init, props) {
    const {
        socket
    } = props;

    const [serviceMenu, setServiceMenu] = useState(init);
    const eventHandlers = {
        getServiceMenu: (items) => {
            setServiceMenu(items)
        }
    }


    useSocketListener(socket, eventHandlers);

    async function refresh() {
        socket.emit('getServiceMenu');
    }

    return {
        get: serviceMenu,
        refresh
    }
    
}