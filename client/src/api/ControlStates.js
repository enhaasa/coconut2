import React, { createContext, useState } from 'react';
import useContextMenu from './hooks/useContextMenu';

const ControlStatesContext = createContext();

function ControlStatesProvider({ children }) {

    const [ selectedSection, setSelectedSection ] = useState(1);
    const [ selectedCustomer, setSelectedCustomer ] = useState(null);
    const [ selectedSeating, setSelectedSeating ] = useState(null);
    const [ selectedCustomerManager, setSelectedCustomerManager ] = useState(null);
    const [ itemInMovement, setItemInMovement ] = useState(null);
    const [ contextMenu, handleContextMenu, hideContextMenu ] = useContextMenu();
    const [ isDangerousSettings, setIsDangerousSettings ] = useState(false);
    const [ showRawMenu, setShowRawMenu ] = useState(false);

    return (
        <ControlStatesContext.Provider value={{
            selectedSection,
            selectedCustomer,
            selectedSeating,
            selectedCustomerManager,
            itemInMovement,
            contextMenu,
            isDangerousSettings,
            showRawMenu,

            setSelectedSection,
            setSelectedCustomer,
            setSelectedSeating,
            setSelectedCustomerManager,
            setItemInMovement,
            handleContextMenu,
            hideContextMenu,
            setIsDangerousSettings,
            setShowRawMenu,
        }}>
            {children}
        </ControlStatesContext.Provider>    
    )
}

export { ControlStatesProvider, ControlStatesContext };