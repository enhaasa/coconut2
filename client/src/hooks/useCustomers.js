import { useState, useRef } from 'react';
import db from '../dbTools_client';
import uuid from 'react-uuid';


function useCustomers(init, props) {
    const { 
        updateUpdates,
        orders,
        setSelectedCustomer
    } = props;

    const [ customers, setCustomers ] = useState(init);

    const updateId = useRef(null);

    /**
     * Add a new customer.
     * 
     * @param {object} table - A table object that the customer will be referenced to.
     */
    function add(table) {
        const newCustomer = {
          name: "",
          floor: table.floor,
          table: table.id,
          id: uuid()
        }
    
        setCustomers(prev => (
            [...prev, newCustomer]
        ))
    
        db.customers.post(newCustomer);
        updateUpdates("customers");
        setSelectedCustomer(null);
    }

    function remove(id, table){
        orders.removeAllUndelivered(id);
        orders.removeAllUnpaid(id);

        setCustomers(prev => (
            prev.filter(customer => (
                customer.id !== id
            ))
        ));

        const customersInTable = customers.filter(customer => (
            customer.table === table.id
        ));
        
        if (customersInTable.length-1 === 0) {
            db.tables.put('session', null, 'id', table.id);

            /*
            setTables(prev => {
            prev[table.id].session = null;
            return [...prev];
            })
            */
        }
        
        db.customers.delete(id);
        updateUpdates("customers");
        setSelectedCustomer(null);
    }

    function editName(id, newName) {
        const index = customers.map(customer => customer.id).indexOf(id);

        setCustomers(prev => {
            prev[index].name = newName;
            return [...prev];
        });

        db.customers.put(id, newName);
        updateUpdates("customers");
    }

    function refresh() {
        db.customers.get().then(res => {setCustomers(res)});
    }

    return [ 
            {   
                get: customers,
                add: add,
                remove: remove,
                editName: editName,
                refresh: refresh
            }
        ]
}

export default useCustomers;