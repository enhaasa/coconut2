import React, { useContext } from 'react';

//Components
import IconButton from '../common/IconButton/IconButton';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';

//Subcomponents
import WatchSeatingSettingsModal from './_WatchSeatingSettingsModal';
import WatchSeatingInfoModal from './_WatchSeatingInfoModal';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Icons
import orderIcon from './../../assets/icons/order-small-white.png';
import serviceIcon from './../../assets/icons/handshake-white.png';
import seatingIcon from './../../assets/icons/table-white.png';

export default function WatchSeating({ seating, handleModal }) {

    const {
        localSettings
    } = useContext(DynamicDataContext);

    const {
        getWatchTriggers
    } = localSettings;

    const options = [
        ['seating', seatingIcon,
        'Audio notification when the seating is taken.'],
        ['orders', orderIcon,
        'Audio notification when an order is added or is late.'],
        ['services', serviceIcon,
        'Audio notification when a service is added or is late.'],
    ];
    
    function getTriggerIcon(trigger) {
        const result = options.find(o => o[0] === trigger);

        if (!result) return null;
        return <img src={result[1]} alt={trigger} />
    }

    function getWatchSeatingInfoModal() {
        return (
            <Modal closeButtonEvent={() => handleModal(null)} title='Watching a seating'>
                <WatchSeatingInfoModal />
            </Modal>
        )
    }
    
    function getWatchSeatingSettingsModal(seating) {
        return (
            <Modal closeButtonEvent={() => handleModal(null)} title='Watch Settings'>
                <WatchSeatingSettingsModal 
                    seating={seating} 
                    options={options}
                    getTriggers={getWatchTriggers}
                    getTriggerStatus={getTriggerStatus}
                />
            </Modal>
        )
    }

    function getTriggerStatus(triggers, trigger) {
        const status = triggers.includes(trigger);

        return status;
    }
    
    function getWatchStatus(id) {
        const seatingSettings = localSettings.watchedSeatings.find(ws => ws.id === id);
    
        if (!seatingSettings || seatingSettings.triggers.length === 0) {
            return <div className='empty'>Not watching</div>;
        }
    
        return (
            <>
                <span>Watching:</span>
                {seatingSettings.triggers.map(trigger => (
                    <span className='trigger'>{getTriggerIcon(trigger)}</span>
                ))}
                
            </>
        )
    }

    return (
        <div className='watch-seating'>
            <div className='title'>
                {getWatchStatus(seating.id)}
            </div>
            <Button
                clickEvent={() => handleModal(getWatchSeatingSettingsModal(seating))} 
                type='dark'
                >Watch Settings</Button>
        </div>
    )
}