import { useState } from 'react';
import useSocketListener from '../useSocketListener';

export default function useTips(init, props) {
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
            });
        }
    }

    useSocketListener(socket, eventHandlers);

    function refresh() {
        socket.emit('getTips');
    }

    function add(tip, requestID) {
        socket.emit('addTip', { tip, requestID });
    }

    function edit(data, requestID) {
        const { tip, newName, newAmount } = data;
        
        socket.emit('editTip', { tip, newName, newAmount, requestID });
    }

    function remove(tip, requestID) {
        socket.emit('removeTip', { tip, requestID });
    }

    return {
        get: tips,
        add: add,
        edit: edit,
        remove: remove,
        refresh: refresh
    }
}