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
        addCustomer: (customer) => {
            add(customer, false);
        },
    
        removeCustomer: (id, table) => {
            remove(id, table, false);
        },
    
        editCustomerName: (id, name) => {
            editName(id, name, false);
        },

        setCustomerSession: (id, session) => {
            setSession(id, session, false);
        },
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

    function remove(id, table, updateDatabase = true){
        orders.removeAllUndelivered(id);
        orders.removeAllUnpaid(id);

        setCustomers(prev => (
            prev.filter(customer => (
                customer.id !== id
            ))
        ));

        if(table) {
            const customersInTable = customers.filter(customer => (
                customer.table === table.id
            ));
            
            if (customersInTable.length-1 === 0) {
                db.tables.put('session', null, 'id', table.id);
            }
        }
        
        if (updateDatabase) {
            socket.emit("removeCustomer", { id: id, table: table });
            setSelectedCustomer(null);
        }
    }

    function removeAllFromTable(table) {
        const customersInTable = customers.filter(customer => (
            customer.table === table.id
        ));

        customersInTable.forEach(customer => {
            orders.removeAllUndelivered(customer.id);
            orders.removeAllUnpaid(customer.id);
            remove(customer.id, table);
        });

        db.tables.put('session', null, 'id', table.id);
    }


    function editName(id, newName, updateDatabase = true) {
        const index = customers.findIndex(customer => customer.id === id);

        setCustomers(prev => {
            prev[index].name = newName;
            return [...prev];
        });

        if (updateDatabase) {
            //db.customers.put("name", newName, "id", id);
            socket.emit("editCustomerName", { id: id, name: newName});
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
        db.customers.get().then(res => {setCustomers(res)});
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