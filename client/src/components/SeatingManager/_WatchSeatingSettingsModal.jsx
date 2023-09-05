import React, { useContext } from 'react';

//Components
import Toggle from '../common/Toggle/Toggle';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Tools
import uuid from 'react-uuid';
import { capitalizeFirstLetter } from '../../utils/names';

export default function WatchSeatingSettingsModal( props ) {

    const {
        seating,
        options
    } = props;

    const {
        localSettings
    } = useContext(DynamicDataContext);

    function getTriggers(id) {
        const seatingSettings = localSettings.watchedSeatings.find(ws => ws.id === id);

        if (seatingSettings) return seatingSettings.triggers;
        return [];
    }

    function getTriggerStatus(triggers, trigger) {
        const status = triggers.includes(trigger);

        return status;
    }

    return (
        <div className='WatchSeatingSettingsModal'>
            <div className='options'>
                {options.map(option => (
                    <div className='option' key={uuid()}>
                        <div className='nav'> 
                            <span className='label'>
                                <img src={option[1]} alt={option[0]} />
                                {capitalizeFirstLetter(option[0])}
                            </span>
                            <Toggle 
                                value={getTriggerStatus(getTriggers(seating.id), option[0])} 
                                clickEvent={() => localSettings.toggleWatchSeating(seating.id, option[0])}
                            />
                        </div>
                        <div className='description'>{option[2]}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}