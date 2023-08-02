import React, { createContext } from 'react';

const StaticDataContext = createContext();

function StaticDataContextProvider({ children }) {

    const MAX_DELIVERY_TIME = 600000;
    const MAX_NAME_PREVIEW = 1;
    const MAX_TABLE_NUMBER = 99;

    return (
        <StaticDataContext.Provider value={{
            MAX_DELIVERY_TIME,
            MAX_NAME_PREVIEW,
            MAX_TABLE_NUMBER,
        }}>
            {children}
        </StaticDataContext.Provider>    
    )
}

export { StaticDataContextProvider, StaticDataContext };