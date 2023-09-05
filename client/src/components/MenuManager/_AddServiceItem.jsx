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
    const [ prefStartTime, setPrefStartTime] = useState(null);
    const [ prefStartDate, setPrefStartDate ] = useState(null);
    const [ isScheduled, setIsScheduled ] = useState(false);

    const [ isTimespan, setIsTimespan ] = useState(false);
    const [ startTime, setStartTime ] = useState(null);
    const [ startDate, setStartDate ] = useState(null);
    const [ endTime, setEndTime ] = useState(null);
    const [ endDate, setEndDate ] = useState(null);


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
                <span className='label'>Preferred start</span>

                <MultiToggle >
                    <MultiToggleOption 
                        isActive={!isScheduled}
                        clickEvent={() => setIsScheduled(false)}
                        >Ask Customer
                    </MultiToggleOption>

                    <MultiToggleOption 
                        isActive={isScheduled}
                        clickEvent={() => setIsScheduled(true)}
                        >Schedule
                    </MultiToggleOption>
                </MultiToggle>

            </div>

            {isScheduled &&
                <>
                    <div className={`row ${!isScheduled && 'transparent ghost'}`}>
                        <span className='label'>Time</span>
                        <span className='selector'>
                            <input 
                                type='time' 
                                onChange={(event) => setPrefStartTime(event.target.value)}
                                />
                        </span>
                    </div>

                    <div className={`row ${!isScheduled && 'transparent ghost'}`}>
                        <span className='label'>Date</span>
                        <span className='selector'>
                            <input 
                                type='date' 
                                onChange={(event) => setPrefStartDate(event.target.value)}
                                />
                        </span>
                    </div>
                </>
            }

            <div className='row'>
                <span className='label'>Timespan</span>

                <MultiToggle >
                    <MultiToggleOption 
                        isActive={!isTimespan}
                        clickEvent={() => setIsTimespan(false)}
                        >Dynamic
                    </MultiToggleOption>

                    <MultiToggleOption 
                        isActive={isTimespan}
                        clickEvent={() => setIsTimespan(true)}
                        >Static
                    </MultiToggleOption>
                </MultiToggle>
            </div>

            {isTimespan &&
                <>
                    
                    <div className='divider-row'>
                        <div className='row'>
                            <span className='label'>Start Time</span>
                            <span className='selector'>
                                <input 
                                    type='time' 
                                    onChange={(event) => setStartTime(event.target.value)}
                                    />
                            </span>
                        </div>

                        <div className='row'>
                            <span className='label'>Start Date</span>
                            <span className='selector'>
                                <input 
                                    type='date' 
                                    onChange={(event) => setStartDate(event.target.value)}
                                    />
                            </span>
                        </div>
                    </div>
                    
                    
                    <div className='divider-row'>
                        <div className='row'>
                            <span className='label'>End Time</span>
                            <span className='selector'>
                                <input 
                                    type='time' 
                                    onChange={(event) => setEndTime(event.target.value)}
                                    />
                            </span>
                        </div>

                        <div className='row'>
                            <span className='label'>End Date</span>
                            <span className='selector'>
                                <input 
                                    type='date' 
                                    onChange={(event) => setEndDate(event.target.value)}
                                    />
                            </span>
                        </div>
                    </div>
                </>
            }

            <div className='row bottom-nav'>
                <Button type='neutral' clickEvent={() => handleModal(null)}>Cancel</Button>
                <Button 
                    type='constructive' 
                    pendingResponseClickEvent={{
                        args: [
                            {
                                ...item,
                                price,
                                is_scheduled: isScheduled,
                                pref_start_datetime: `${prefStartDate} ${prefStartTime}`,
                                start_datetime: `${startDate} ${startTime}`,
                                end_datetime: `${endDate} ${endTime}`,
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