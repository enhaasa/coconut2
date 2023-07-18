import { useState } from 'react';
import uuid from 'react-uuid';
import useSocketListener from '../useSocketListener';

function useTips(init, props) {
    const [ tips, setTips ] = useState(init);
    const { socket } = props;

    const eventHandlers = {
        getTips: (tips) => {
            setTips(tips);
        },
        addTip: (tip) => {
            setTips(prev => (
                [...prev, tip]
            ));
        },
        removeTip: (tip) => {
            setTips(prev => (
                prev.filter(t => t.id !== tip.id)
            ));
        },
        editTip: (tip, key, value) => {
            setTips(prev => {
                const index = prev.findIndex(t => t.id === tip.id);

                prev[index][key] = value;
                return [...prev];
            })
        }
    }

    useSocketListener(socket, eventHandlers);

    function refresh() {
        socket.emit('getTips');
    }

    function add(tip) {
        socket.emit('addTip', tip);
    }

    function edit(data) {
        const { tip, newName, newAmount } = data;
        
        console.log(newName, newAmount)
        socket.emit('editTip', {tip, newName, newAmount});
    }

    function remove(tip) {
        socket.emit('removeTip', tip);
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