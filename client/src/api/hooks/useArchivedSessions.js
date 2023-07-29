import React, { useState, useEffect } from 'react';
import useSocketListener from '../useSocketListener';

export default function useArchivedSessions(init, props) {
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
        },
        setArchivedSessionAmountPaid: (data) => {
            const { session, amount, } = data;

            setArchivedSessions(prev => {
                const index = archivedSessions.findIndex(s => s.id === session.id);

                prev[index].amount_paid = amount;
                return [...prev];
            })
        }
    }

    useSocketListener(socket, eventHandlers);



    function add(session) {
        socket.emit('addArchivedSession', session);
    }

    function setAmountPaid(session, amount) {
        socket.emit('setArchivedSessionAmountPaid', { session, amount});
    }

    function refresh() {
        socket.emit('getArchivedSessions');
    }

    return [
        {
            get: archivedSessions,
            add,
            setAmountPaid,
            refresh
        }
    ]
}