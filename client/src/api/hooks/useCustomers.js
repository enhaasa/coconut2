import { useState } from 'react';
import useSocketListener from './../useSocketListener';

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
            setCustomers(prev => (
                [...prev, customer]
            ));

            setSelectedCustomer(null);
        },
    
        removeCustomer: (customerToRemove) => {
            setCustomers(prev => (
                prev.filter(customer => (
                    customer.uuid !== customerToRemove.uuid
                ))
            ));

            setSelectedCustomer(null);
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
    function add(customer) {
        socket.emit("addCustomer", { ...customer });
    }

    function remove(customerToRemove){        
        socket.emit("removeCustomer", { ...customerToRemove });
    }

    function editName(uuid, name, isDebounced = true) {
        if (isDebounced) {
            socket.emit("editCustomerName", { uuid: uuid, name: name });
        }

        const index = customers.findIndex(customer => customer.uuid === uuid);
        setCustomers(prev => {
            prev[index].name = name;
            return [...prev];
        });
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