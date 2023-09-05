import React, { useState, useRef, useContext } from 'react';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

export default function Name({ customer }) {

    const {
        customers
    } = useContext(DynamicDataContext);

    const [ nameBuffer, setNameBuffer ] = useState(customer.name);

    let timer = useRef();

    function handleNamePaste(event) {
        const pastedValue = event.clipboardData.getData('text');
        if (pastedValue.length + customer.name.length > 50) {
          setNameBuffer(pastedValue);
          event.preventDefault();
        }
    }

    function handleNameChange(event) {
        const { value } = event.target;
        if (value.length <= 50) {
            setNameBuffer(value);
        
            if (timer.current) {
            clearTimeout(timer.current);
            }
        
            const currentNameBuffer = value; 
            timer.current = setTimeout(() => {
                customers.editName(customer, currentNameBuffer); 
            }, 2000);
        }
    }

    return (
        <input 
            spellCheck={false}
            type='text' 
            value={nameBuffer} 
            placeholder='Enter name...' 
            maxLength={50}
            onPaste={handleNamePaste}
            onChange={handleNameChange}>
        </input>
    )
}