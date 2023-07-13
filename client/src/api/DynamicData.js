import React, { useContext, createContext, useEffect } from 'react';
import useSections from './hooks/useSections';
import useTables from './hooks/useTables';
import useArchivedOrders from './hooks/useArchivedOrders';
import useArchivedSessions from './hooks/useArchivedSessions';
import useOrders from './hooks/useOrders';
import useCustomers from './hooks/useCustomers';
import useSessions from './hooks/useSessions';
import useTips from './hooks/useTips';
import useMenu from './hooks/useMenu';
import useStaff from './hooks/useStaff';

const DynamicDataContext = createContext();

function DynamicDataProvider({ children, socket, selectedTableTracker, setSelectedCustomer }) {
    const [ archivedOrders ] = useArchivedOrders([]);
    const [ archivedSessions ] = useArchivedSessions([]);
    const [ tips ] = useTips([]);
    const [ staff ] = useStaff([]);

    const [ sections ] = useSections([], {
        socket: socket
    });

    const [ tables ] = useTables([], {
        selectedTableTracker: selectedTableTracker, 
        socket: socket
    });

    const [ orders ] = useOrders([], {
        archivedOrders: archivedOrders,
        archivedSessions: archivedSessions,
        socket: socket
    });

    const [ customers ] = useCustomers([], {
        setSelectedCustomer,
        orders: orders,
        socket: socket
    });
  
    const [ sessions ] = useSessions([], {
        socket: socket
    });

    const [ menu ] = useMenu([], {
        selectedTableTracker, 
        socket: socket
    });

    
    useEffect(() => {
        if (socket) {
            sections.refresh();
            tables.refresh();
            orders.refresh();
            customers.refresh();
            archivedSessions.refresh();
            archivedOrders.refresh();
            sessions.refresh();
            tips.refresh();
            menu.refresh();
            staff.refresh();
        }
    }, [socket]);

    return (
        <DynamicDataContext.Provider value={{ 
                orders,
                customers,
                sections, 
                sessions,
                tips,
                tables,
                menu,
                staff,
                archivedOrders, 
                archivedSessions,
            }}>
            {children}
        </DynamicDataContext.Provider>
    );
}

export { DynamicDataProvider, DynamicDataContext };