import { useState } from 'react';


export default function useMenu() {

    const [watchedSeatings, setWatchedSeatings] = useState([]);
    const [volume, setVolume] = useState(50);

    function refresh() {
        const storedWatchedSeatings = JSON.parse(localStorage.getItem('watchedSeatings'));
        if (storedWatchedSeatings) setWatchedSeatings(storedWatchedSeatings);

        const storedVolume = localStorage.getItem('volume');
        if (storedVolume) setVolume(storedVolume);
  
    }

    function watchSeating(id, trigger) {
        const exists = watchedSeatings.find(s => s.id === id);
        
        const updatedWatchedSeatings = exists
            ? watchedSeatings.map(s => s.id === id ? { ...s, triggers: [...s.triggers, trigger] } : s)
            : [...watchedSeatings, { id: id, triggers: [trigger] }];
    
        localStorage.setItem('watchedSeatings', JSON.stringify(updatedWatchedSeatings));
    
        setWatchedSeatings(updatedWatchedSeatings);
    }

    function unwatchSeating(id, trigger) {
        const updatedWatchedSeatings = watchedSeatings.map(s => {
            if (s.id === id) {
                const updatedTriggers = s.triggers.filter(t => t !== trigger);
                return { ...s, triggers: updatedTriggers };
            }
            return s;
        });
    
        localStorage.setItem('watchedSeatings', JSON.stringify(updatedWatchedSeatings));
    
        setWatchedSeatings(updatedWatchedSeatings);
    }

    function toggleWatchSeating(id, trigger) {
        const existingSeatingIndex = watchedSeatings.findIndex(s => s.id === id);
    
        if (existingSeatingIndex !== -1) {
            const existingSeating = watchedSeatings[existingSeatingIndex];
            const triggerExists = existingSeating.triggers.includes(trigger);
    
            if (triggerExists) {
                unwatchSeating(id, trigger);
            } else {
                watchSeating(id, trigger);
            }
        } else {
            watchSeating(id, trigger);
        }
        console.log(watchedSeatings)
    }

    function getWatchTriggers(id) {
        const seatingSettings = watchedSeatings.find(ws => ws.id === id);

        if (seatingSettings) return seatingSettings.triggers;
        return [];
    }

    function adjustVolume(level) {
        localStorage.setItem('volume', level);
        setVolume(level);
    }
   
    return {
        watchedSeatings,
        watchSeating,
        unwatchSeating,
        toggleWatchSeating,
        getWatchTriggers,
        adjustVolume,
        refresh
    }
    
}