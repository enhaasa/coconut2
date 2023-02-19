import { useState } from 'react';
import db from '../dbTools_client';

function useArchivedOrders(init) {
    const [ archivedOrders, setArchivedOrders ] = useState(init);

    function refresh() {
        db.archivedOrders.get().then(res => {setArchivedOrders(res)});
    }

    return [
        {
            get: archivedOrders,
            refresh: refresh
        }
    ]
}

export default useArchivedOrders;