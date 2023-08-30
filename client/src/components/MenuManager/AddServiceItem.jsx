import React, { useState, useContext } from 'react';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';

//Components
import Button from '../common/Button/Button';
import MultiToggle from '../common/MultiToggle/MultiToggle';
import MultiToggleOption from '../common/MultiToggle/MultiToggleOption';


export default function AddServiceItemModal({ handleModal, item }) {

    const { serviceItems, services, sections } = useContext(DynamicDataContext);
    const { selectedCustomer, selectedSection, selectedSeating } = useContext(ControlStatesContext);

    const [ price, setPrice ] = useState(item.price);
    const [ startTime, setStartTime] = useState(null);
    const [ startDate, setStartDate ] = useState(null);
    const [ immediateStart, setImmediateStart ] = useState(true);

    function getPrice(item) {
        if (item.minute_interval === 0) {
            return `${item.price.toLocaleString('en-US')} gil`;
        } 
        return `${item.price.toLocaleString('en-US')} gil / ${item.minute_interval} minutes`;
    }

    return (
        <div className='AddServiceItem'>
            <div className='row'>
                <span className='label'>Price </span>
                <MultiToggle>
                    <MultiToggleOption
                        isActive={price === item.price}
                        clickEvent={() => setPrice(item.price)}
                    >{getPrice(item)}</MultiToggleOption>
                    <MultiToggleOption
                        isActive={price === 0}
                        clickEvent={() => setPrice(0)}
                    >Free</MultiToggleOption>
                </MultiToggle>
            </div>

            
            <div className='row'>
                <span className='label'>Start</span>

                <MultiToggle >
                    <MultiToggleOption 
                        isActive={immediateStart}
                        clickEvent={() => setImmediateStart(true)}
                        >Immediately</MultiToggleOption>
                    <MultiToggleOption 
                        isActive={!immediateStart}
                        clickEvent={() => setImmediateStart(false)}
                        >Specify Time</MultiToggleOption>
                </MultiToggle>

            </div>

            <div className={`row ${immediateStart && 'transparent ghost'}`}>
                <span className='label'>Time</span>
                <span className='selector'>
                    <input 
                        type='time' 
                        onChange={(event) => setStartTime(event.target.value)}
                        />
                </span>
            </div>

            <div className={`row ${immediateStart && 'transparent ghost'}`}>
                <span className='label'>Date</span>
                <span className='selector'>
                    <input 
                        type='date' 
                        onChange={(event) => setStartDate(event.target.value)}
                        />
                </span>
            </div>

            <div className='row bottom-nav'>
                <Button type='neutral' clickEvent={() => handleModal(null)}>Cancel</Button>
                <Button 
                    type='constructive' 
                    pendingResponseClickEvent={{
                        args: [
                            {
                                ...item,
                                price,
                                immediateStart,
                                start_datetime: `${startDate} ${startTime}`,
                                end_datetime: null,
                                is_completed: false,
                                section_id: sections.get[selectedSection].id,
                                customer_id: selectedCustomer.id,
                                seating_id: selectedSeating.id,
                            }
                        ],
                        event: services.add,
                    }}
                    postEventCallback={() => handleModal(null)}
                >Add</Button>
            </div>
        </div>
    )
}