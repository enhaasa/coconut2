import { useState } from 'react';
import useSocketListener from './../useSocketListener';

export default function useCustomers(init, props) {
    const { 
        setSelectedCustomer,
        selectedCustomer,
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

            if (selectedCustomer) {
                setSelectedCustomer(prev => (
                    {...prev, name: name}
                ));
            }
            setCustomers(prev => {
                prev[index].name = name; 
                return [...prev];
            });
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

    function refresh() {
        socket.emit('getCustomers');
    }

    return {   
        get: customers,
        setCustomers: setCustomers,
        add: add,
        remove: remove,
        editName: editName,
        refresh: refresh
    }
    
}