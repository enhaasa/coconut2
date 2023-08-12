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
            });
        },
        setSectionPointerAttribute: (data) => {
            const { sectionPointer, attribute, value } = data;
            const index = sectionPointers.findIndex(sp => sp.id === sectionPointer.id);

            setSectionPointers(prev => {
                prev[index][attribute] = value;
                return [...prev];
            });
        },
        setSectionPointerAttributes: (data) => {
            const { sectionPointer, attributes } = data;
            const index = sectionPointers.findIndex(sp => sp.id === sectionPointer.id);

            setSectionPointers(prev => {
                attributes.forEach(a => {
                    prev[index][a[0]] = a[1];
                });

                return [...prev];
            });
        },
        removeSectionPointer: (sectionPointer) => {
            setSectionPointers(prev => (
                prev.filter(s => (
                    s.id !== sectionPointer.id
                ))
            ));
        },
        addSectionPointer: (sectionPointer) => {
            setSectionPointers(prev => (
                [...prev, sectionPointer]
            ));
        }
    }
    
    useSocketListener(socket, eventHandlers);

    async function refresh() {
        socket.emit('getSectionPointers');
    }

    async function setLocation(sectionPointer, newLocation) {
        socket.emit('setSectionPointerLocation', { sectionPointer, newLocation });
    }

    async function setAttribute(sectionPointer, attribute, value, requestID) {
        socket.emit('setSectionPointerAttribute', { sectionPointer, attribute, value, requestID });
    }

    async function setAttributes(sectionPointer, attributes, requestID) {
        console.log(attributes)
        socket.emit('setSectionPointerAttributes', { sectionPointer, attributes, requestID });
    }

    async function add(sectionPointer, requestID) {
        socket.emit('addSectionPointer', { sectionPointer, requestID });
    }

    async function remove(sectionPointer, requestID) {
        socket.emit('removeSectionPointer', { sectionPointer, requestID });
    }

    return {
        get: sectionPointers,
        setLocation,
        setAttribute,
        setAttributes,
        add,
        remove,
        refresh,
    }
    

}