import { useState } from 'react';
import useSocketListener from './../useSocketListener';

export default function useCustomers(init, props) {
    const { 
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
                    customer.id !== customerToRemove.id
                ))
            ));

            setSelectedCustomer(null);
        },
    
        editCustomerName: (data) => {
            const { name } = data;
            const { id } = data.customer;
            const index = customers.findIndex(c => c.id === id);

            setCustomers(prev => {
                prev[index].name = name; 
                return [...prev];
            });
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

    function editName(customer, name) {
        socket.emit('editCustomerName', { customer: customer, name: name });
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

    return {   
        get: customers,
        add: add,
        remove: remove,
        setSession: setSession,
        editName: editName,
        refresh: refresh
    }
    
}