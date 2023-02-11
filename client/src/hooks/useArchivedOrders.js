import { useState } from 'react';
import dbTools_client from '../dbTools_client';

function useArchivedOrders(init) {
    const [ archivedOrders, setArchivedOrders ] = useState(init);

    function refresh() {
        dbTools_client.archivedOrders.get().then(res => {setArchivedOrders(res)});
    }

    return [
        {
            get: archivedOrders,
            refresh: refresh
        }
    ]
}

export default useArchivedOrders;