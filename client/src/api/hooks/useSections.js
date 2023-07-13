import { useState } from 'react';
import useSocketListener from './../useSocketListener';


export default function useSections(init, props) {
    const { socket } = props;

    const [ sections, setSections ] = useState(init);
    const eventHandlers = {
        getSections: (sections) => {
            setSections(sections);
        }
    }

    useSocketListener(socket, eventHandlers);

    function refresh() {
        socket.emit("getSections");
    }

    return [
        {
            get: sections,
            refresh
        }
    ]
}