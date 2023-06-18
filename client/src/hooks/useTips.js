import { useState } from 'react';
import db from '../dbTools_client';
import uuid from 'react-uuid';

function useTips(init, props) {
    const [ tips, setTips ] = useState(init);
    const { updateUpdates } = props;

    function refresh() {
        //console.log("Refreshed tips.");
        db.tips.get().then(res => {
            setTips(res)
        });
    }

    function add(tip) {
        const id = uuid();
        db.tips.post({id: id, ...tip});
        setTips(prev => [...prev, {...tip, id: id}]);
        updateUpdates("tips");
    }

    function edit(tip) {
        const index = tips.map(t => t.id).indexOf(tip.id);

        db.tips.put(tip.id, "name", tip.name);
        db.tips.put(tip.id, "amount", tip.amount);

        setTips(prev =>  {
            prev[index] = tip;
            return prev;
        })
        updateUpdates("tips");
    }

    function remove(tip) {
        const index = tips.map(t => t.id).indexOf(tip.id);

        db.tips.delete(tip.id);

        setTips(prev => prev.filter(item => item.id !== tip.id));
        updateUpdates("tips");
    }

    return [
        {
            get: tips,
            add: add,
            edit: edit,
            remove: remove,
            refresh: refresh
        }
    ]
}

export default useTips;