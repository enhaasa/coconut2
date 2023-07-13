import { useState } from 'react';
import useSocketListener from './../useSocketListener';


export default function useSessions(init, props) {
    const { socket } = props;

    const [ sessions, setSessions ] = useState(init);
    const eventHandlers = {
        getSessions: (sections) => {
            setSessions(sections);
        }
    }

    useSocketListener(socket, eventHandlers);

    function refresh() {
        socket.emit("getSessions");
    }

    return [
        {
            get: sessions,
            refresh
        }
    ]
}