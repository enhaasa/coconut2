import { useState, useEffect } from 'react';
import db from '../dbTools_client';

function useArchivedOrders(init, props) {
    const [ archivedOrders, setArchivedOrders ] = useState(init);
    const { updateUpdates } = props;

    function refresh() {
        db.archivedOrders.get().then(res => {setArchivedOrders(res)});
    }

    function add(order) {
        setArchivedOrders(prev => (
            [...prev, order]
        ));
    
        db.archivedOrders.post(order);
        updateUpdates("archivedSessions");
    }

    return [
        {
            get: archivedOrders,
            add: add,
            refresh: refresh
        }
    ]
}

export default useArchivedOrders;