import { useState } from 'react';
import db from '../dbTools_client';
import uuid from 'react-uuid';

function useArchivedSessions(init, props) {
    const [ archivedSessions, setArchivedSessions ] = useState(init);
    const { updateUpdates } = props;

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

    return [
        {
            get: archivedSessions,
            add: add,
            refresh: refresh
        }
    ]
}

export default useArchivedSessions;