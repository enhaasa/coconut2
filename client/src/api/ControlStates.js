import React, { createContext, useState } from 'react';

const ControlStatesContext = createContext();

function ControlStatesProvider({ children }) {

    const [ selectedSection, setSelectedSection ] = useState(1);
    const [ selectedCustomer, setSelectedCustomer ] = useState(null);
    const [ selectedSeating, setSelectedSeating ] = useState(null);
    const [ selectedCustomerManager, setSelectedCustomerManager ] = useState(null);
    const [ itemInMovement, setItemInMovement ] = useState(null);

    return (
        <ControlStatesContext.Provider value={{
            selectedSection,
            selectedCustomer,
            selectedSeating,
            selectedCustomerManager,
            itemInMovement,

            setSelectedSection,
            setSelectedCustomer,
            setSelectedSeating,
            setSelectedCustomerManager,
            setItemInMovement
        }}>
            {children}
        </ControlStatesContext.Provider>    
    )
}

export { ControlStatesProvider, ControlStatesContext };