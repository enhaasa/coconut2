import { useState } from 'react';
import useSocketListener from './../useSocketListener';

export default function useSections(init, props) {
    const { socket } = props;

    const [ sections, setSections ] = useState(init);
    const eventHandlers = {
        getSections: (sections) => {
            setSections(sections);
        },
        addSection: (section) => {
            setSections(prev => [...prev, section]);
        }
    }

    useSocketListener(socket, eventHandlers);

    function refresh() {
        socket.emit('getSections');
    }

    function add() {
        socket.emit('addSection');
    }

    return [
        {
            get: sections,
            add,
            refresh
        }
    ]
}