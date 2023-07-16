import React, { useState } from 'react';
import useSocketListener from '../useSocketListener';

function useArchivedSessions(init, props) {
    const {
        socket
    } = props;

    const [ archivedSessions, setArchivedSessions ] = useState(init);

    const eventHandlers = {
        getArchivedSessions: (sessions) => {
            setArchivedSessions(sessions);
        },
        addArchivedSession: (session) => {
            
            session.channel = JSON.parse(session.channel);
            session.customers = JSON.parse(session.customers);
            session.orders = JSON.parse(session.orders);

            setArchivedSessions(prev => [...prev, session]);
        }
    }

    useSocketListener(socket, eventHandlers);

    function add(session) {
        socket.emit('addArchivedSession', session);
    }

    function refresh() {
        socket.emit('getArchivedSessions');
    }

    return [
        {
            get: archivedSessions,
            add,
            refresh
        }
    ]
}

export default useArchivedSessions;