import React, { useState, useContext } from 'react';

//Contexts
import { StaticDataContext } from '../../api/StaticData';
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';

//Components
import Button from '../common/Button/Button';

export default function AddSeatingModal({ setModal }) {

    const { MAX_TABLE_NUMBER } = useContext(StaticDataContext);
    const { seatings, sections } = useContext(DynamicDataContext);
    const { selectedSection } = useContext(ControlStatesContext);

    function getNextNumber() {
        return seatings.get.reduce((t, c) => Math.max(t , c.number), 0) + 1;
    }
    
    const [ number, setNumber ] = useState(getNextNumber());
    
    function handleNumberChange({ target }) {
        const inputValue = parseInt(target.value, 10);

        if(inputValue <= MAX_TABLE_NUMBER) {
            setNumber(target.value);
        }
    }

    function getSection() {
        return sections.get[selectedSection];
    }

    return (
        <div className='AddSeatingModal'>
            <div className='row'>
                <span className='label'>Number</span>
                <span className='selector'>
                    <input 
                        type='number' 
                        placeholder='Enter number...' 
                        onChange={handleNumberChange}
                        value={number}
                        />
                </span>
            </div>

            <div className='row bottom-nav'>
                <Button type='neutral' clickEvent={() => setModal(null)}>Cancel</Button>
                <Button 
                    type='constructive' 
                    pendingResponseClickEvent={{
                        args: [getSection(), number],
                        event: seatings.add,
                    }}
                    postEventCallback={() => setModal(null)}
                >Create</Button>
            </div>
        </div>
    )
}