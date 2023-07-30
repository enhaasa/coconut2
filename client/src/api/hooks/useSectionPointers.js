import { useState } from 'react';
import useSocketListener from './../useSocketListener';

export default function useSectionPointers(init, props) {
    const { socket } = props;

    const [ sectionPointers, setSectionPointers ] = useState(init);
    const eventHandlers = {
        getSectionPointers: (section_pointers) => {
            setSectionPointers(section_pointers);
        },
        setSectionPointerLocation: (data) => {
            const { sectionPointer, newLocation } = data;
            const index = sectionPointers.findIndex(sp => sp.id === sectionPointer.id);

            setSectionPointers(prev => {
                prev[index].pos_x = newLocation.pos_x;
                prev[index].pos_y = newLocation.pos_y;
                prev[index].section_id = newLocation.section_id;
                
                return [...prev];
            })
        }
    }
    
    useSocketListener(socket, eventHandlers);

    async function refresh() {
        socket.emit('getSectionPointers');
    }

    async function setLocation(sectionPointer, newLocation) {
        socket.emit('setSectionPointerLocation', { sectionPointer, newLocation });
    }

    return [
        {
            get: sectionPointers,
            setLocation,
            refresh
        }
    ]

}