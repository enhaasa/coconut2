import { useState } from 'react';
import useSocketListener from './../useSocketListener';

export default function useCustomers(init, props) {
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

        removeAllCustomersFromSeating: (seating) => {
            setCustomers(prev => (
                prev.filter(customer => customer.seating_id !== seating.id)
            ));
        }
    }
 
    useSocketListener(socket, eventHandlers);


    function add(customer) {
        socket.emit('addCustomer', { ...customer });
    }

    function remove(customerToRemove){        
        socket.emit('removeCustomer', { ...customerToRemove });
    }

    function editName(uuid, name, isDebounced = true) {
        if (isDebounced) {
            socket.emit('editCustomerName', { uuid: uuid, name: name });
        }

        const index = customers.findIndex(customer => customer.uuid === uuid);
        setCustomers(prev => {
            prev[index].name = name;
            return [...prev];
        });
    }

    function removeAllFromSeating(seating) {
        socket.emit('removeAllCustomersFromSeating', { ...seating });
    }

    function setSession(id, newSession, updateDatabase = true) {
        const index = customers.findIndex(customer => customer.id === id);

        setCustomers(prev => {
            prev[index].session = newSession;
            return [...prev];
        });

        if (updateDatabase) {
            socket.emit('setCustomerSession', { session: newSession, id: id })
        }
        //db.customers.put('session', newSession, 'id', id);
    }

    function refresh() {
        socket.emit('getCustomers');
    }

    return [ 
            {   
                get: customers,
                add: add,
                remove: remove,
                removeAllFromSeating: removeAllFromSeating,
                setSession: setSession,
                editName: editName,
                refresh: refresh
            }
        ]
}