import { useState } from 'react';
import db from '../dbTools_client';

function useTips(init) {
    const [ tips, setTips ] = useState(init);

    function refresh() {
        db.archivedOrders.get().then(res => {setTips(res)});
    }

    return [
        {
            get: archivedOrders,
            refresh: refresh
        }
    ]
}

export default useTips;