import { useState } from 'react';
import useSocketListener from './useSocketListener';
import db from '../dbTools_client';

function useCustomers(init, props) {
    const { 
        orders,
        setSelectedCustomer,
        socket
    } = props;

    const [customers, setCustomers] = useState(init);
    const eventHandlers = {
        getCustomers: (customers) => {
            setCustomers(customers);
        },

        addCustomer: (customer) => {
            add(customer, false);
        },
    
        removeCustomer: (uuid, table) => {
            remove(uuid, table, false);
        },
    
        editCustomerName: (uuid, name) => {
            editName(uuid, name, false);
        },

        setCustomerSession: (id, session) => {
            setSession(id, session, false);
        },

        removeAllCustomersFromTable: () => {
            removeAllFromTable();
        }
    }
 
    useSocketListener(socket, eventHandlers);

    /**
     * Add a new customer.
     * 
     * @param {object} table - A table object that the customer will be referenced to.
     */
    function add(customer, updateDatabase = true) {
        setCustomers(prev => (
            [...prev, customer]
        ));
    
        //db.customers.post(newCustomer);

        if (updateDatabase) {
            socket.emit("addCustomer", { customer: customer });
            setSelectedCustomer(null);
        }
    }

    function remove(uuid, tableID, updateDatabase = true){
        //orders.removeAllUndelivered(id);
        //orders.removeAllUnpaid(id);

        setCustomers(prev => (
            prev.filter(customer => (
                customer.uuid !== uuid
            ))
        ));

        if(tableID) {
            const customersInTable = customers.filter(customer => (
                customer.table === tableID
            ));
            
            /*
            if (customersInTable.length-1 === 0) {
                db.tables.put('session', null, 'id', tableID);
            }*/
        }
        
        if (updateDatabase) {
            socket.emit("removeCustomer", { uuid: uuid, tableID: tableID });
            setSelectedCustomer(null);
        }
    }

    function removeAllFromTable(tableID) {
        const customersInTable = customers.filter(customer => (
            customer.table === tableID
        ));

        customersInTable.forEach(customer => {
            orders.removeAllUndelivered(customer.id);
            orders.removeAllUnpaid(customer.id);
            remove(customer.id, tableID);
        });

        socket.emit("removeAllCustomersFromTable", { id: tableID })
    }


    function editName(uuid, newName, updateDatabase = true) {
        const index = customers.findIndex(customer => customer.uuid === uuid);
        
        setCustomers(prev => {
            prev[index].name = newName;
            return [...prev];
        });

        if (updateDatabase) {
            socket.emit("editCustomerName", { uuid: uuid, name: newName});
        }
    }

    function setSession(id, newSession, updateDatabase = true) {
        const index = customers.findIndex(customer => customer.id === id);

        setCustomers(prev => {
            prev[index].session = newSession;
            return [...prev];
        });

        if (updateDatabase) {
            socket.emit("setCustomerSession", { session: newSession, id: id })
        }
        //db.customers.put("session", newSession, "id", id);
    }

    function refresh() {
        socket.emit("getCustomers");
    }

    return [ 
            {   
                get: customers,
                add: add,
                remove: remove,
                removeAllFromTable: removeAllFromTable,
                setSession: setSession,
                editName: editName,
                refresh: refresh
            }
        ]
}

export default useCustomers;