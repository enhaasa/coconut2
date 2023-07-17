import { useState } from 'react';
import uuid from 'react-uuid';
import useSocketListener from '../useSocketListener';

function useTips(init, props) {
    const [ tips, setTips ] = useState(init);
    const { socket } = props;

    const eventHandlers = {
        getTips: (tips) => {
            setTips(tips);
        }
    }

    useSocketListener(socket, eventHandlers);

    function refresh() {
        //socket.emit('getTips');
    }

    function add(tip) {
        const id = uuid();

        setTips(prev => [...prev, {...tip, id: id}]);
    }

    function edit(tip) {
        const index = tips.map(t => t.id).indexOf(tip.id);

        setTips(prev =>  {
            prev[index] = tip;
            return prev;
        })
    }

    function remove(tip) {
        const index = tips.map(t => t.id).indexOf(tip.id);



        setTips(prev => prev.filter(item => item.id !== tip.id));
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