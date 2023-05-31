import { useState, useEffect } from 'react';
import db from '../dbTools_client';
import uuid from 'react-uuid';

function useArchivedSessions(init, props) {
    const { updateUpdates } = props;

    const [ archivedSessions, setArchivedSessions ] = useState(init);

    useEffect(() => {
        totalAmount = archivedSessions.reduce((t, c) => t + c.paidAmount, 0);
    }, [archivedSessions])

    let totalAmount = archivedSessions.reduce((t, c) => t + c.paidAmount, 0);

    function refresh() {
        db.archivedSessions.get().then(res => {setArchivedSessions(res)});
    }

    function add(session) {
        setArchivedSessions(prev => (
            [...prev, session]
        ));
    
        db.archivedSessions.post(session);
        updateUpdates("archivedSessions");
    }

    function editAmountPaid(id, amount) {
        const index = archivedSessions.findIndex(session => session.id === id);

        setArchivedSessions(prev => {
            prev[index].paidAmount = amount;
            return[...prev];
        });

        db.archivedSessions.put("paidAmount", amount, "id", id);
        updateUpdates("archivedSessions");
    }

    return [
        {
            get: archivedSessions,
            getTotalAmount: totalAmount,
            editAmountPaid: editAmountPaid,
            add: add,
            refresh: refresh
        }
    ]
}

export default useArchivedSessions;