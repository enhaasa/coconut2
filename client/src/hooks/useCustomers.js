import React, { useState, useEffect, useRef } from 'react';
import dbTools_client from '../dbTools_client';
import uuid from 'react-uuid';


function useCustomers(initialCustomers) {
    const [ customers, setCustomers ] = useState(initialCustomers);
    const [ selectedCustomer, setSelectedCustomer ] = useState(null);

    const updateId = useRef(null);

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
    
        dbTools_client.customers.post(newCustomer);
        //updateUpdates("customers");
        setSelectedCustomer(null);
    }


    return [ customers, {
        setCustomers : {
            add
        },
        getCustomers : {
            selected: selectedCustomer
        }
    }]
}

export default useCustomers;