import { useState, useContext } from 'react';
import useSocketListener from '../useSocketListener';
import { ControlStatesContext } from '../ControlStates';

import PlaySound from '../../utils/PlaySound.ts';

export default function useSeats(init, props) {
    const { 
        socket,
        localSettings
    } = props;

    const {
        setSelectedSeating
    } = useContext(ControlStatesContext);

    const [seatings, setSeatings] = useState(init);
    const eventHandlers = {
        getSeatings: (seatings) => {
            setSeatings(seatings);
        },
        addSeating: (seating) => {
            setSeatings(prev => (
                [...prev, seating]
            ))
        },

        setSeatingAttribute: (data) => {
            const { seating, attribute, value } = data;
            const index = seatings.findIndex(t => t.id === seating.id);

            setSeatings(prev => {
                prev[index][attribute] = value;
                return [...prev];
            });

            

            if (attribute === 'availability' && value === 'taken') {
                const watchedSeating = localSettings.watchedSeatings.find(ws => ws.id === seating.id);
                console.log(watchedSeating.triggers)

                if (watchedSeating.triggers.includes('seating')) {
                    PlaySound.newService();
                }
            }
        },

        resetSeating: (seatingToReset) => {
        const index = seatings.findIndex(s => s.id === seatingToReset.id);

            setSeatings(prev => {
                prev[index].availability = 'available';
                return [...prev];
            });
        },

        setSeatingLocation: (data) => {
            const { seating, newLocation } = data;
            const index = seatings.findIndex(s => s.id === seating.id);
            
            setSeatings(prev => {
                prev[index].pos_x = newLocation.pos_x;
                prev[index].pos_y = newLocation.pos_y;
                prev[index].section_id = newLocation.section_id;
                
                return [...prev];
            });
        },

        removeSeating: (seating) => {
            setSeatings(prev => (
                prev.filter(s => s.id !== seating.id)
            ));
            setSelectedSeating(null);
        }
    }

    useSocketListener(socket, eventHandlers);

    function add(section, number, requestID) {
        socket.emit('addSeating', {section, number, requestID});
    }

    function toggleAttribute(seating, attribute) {
        const current = seatings.find(t => t.id === seating.id)[attribute];
        setAttribute(seating, attribute, !current);
    }

    function setAvailability(seating, availability) {
        socket.emit('setSeatingAvailability', { seating, availability });
    }

    function setLocation(seating, newLocation) {
        socket.emit('setSeatingLocation', { seating, newLocation });
    }

    function setAttribute(seating, attribute, value) {
        socket.emit('setSeatingAttribute', { seating, attribute, value });
    }

    function reset(seating, requestID) {
        socket.emit('resetSeating', { seating, requestID });
    }

    function remove(seating, requestID) {
        socket.emit('removeSeating', { seating, requestID });
    }

    function refresh() {
        socket.emit('getSeatings');
    }

    return  {
        get: seatings,
        set: setSeatings,
        add,
        remove,
        reset,
        toggleAttribute,
        setAttribute,
        refresh: refresh,
        setLocation,
        setAvailability,
        utils: {
            getSeatingNumberColor
        }
    }
    
    function getSeatingNumberColor(seating) {
        if (seating.availability === 'available') return 'constructive';
        if (seating.availability === 'reserved') return 'progressive';
        if (seating.availability === 'taken') return 'destructive';
    }
}