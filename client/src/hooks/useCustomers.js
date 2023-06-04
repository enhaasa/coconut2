import { useState, useRef } from 'react';
import db from '../dbTools_client';
import uuid from 'react-uuid';
import tools from '../tools';


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
        console.log(table)
        const newCustomer = {
          name: "",
          floor: table.floor,
          table: table.id,
          id: uuid()
        }
    
        setCustomers(prev => (
            [...prev, newCustomer]
        ));
    
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

        if(table) {
            const customersInTable = customers.filter(customer => (
                customer.table === table.id
            ));
            
            if (customersInTable.length-1 === 0) {
                db.tables.put('session', null, 'id', table.id);
                updateUpdates("tables");
            }
        }
        
        db.customers.delete(id);
        updateUpdates("customers");
        setSelectedCustomer(null);
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
        updateUpdates("tables");
    }


    function editName(id, newName, updateServer = true) {
        const index = customers.map(customer => customer.id).indexOf(id);

        setCustomers(prev => {
            prev[index].name = newName;
            return [...prev];
        });

        if (updateServer) {
            db.customers.put("name", newName, "id", id);
            updateUpdates("customers");
        }
    }

    function setSession(id, sessionID) {
        const index = customers.map(customer => customer.id).indexOf(id);

        setCustomers(prev => {
            prev[index].session = sessionID;
            return [...prev];
        });


        db.customers.put("session", sessionID, "id", id);
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
                removeAllFromTable: removeAllFromTable,
                setSession: setSession,
                editName: editName,
                refresh: refresh
            }
        ]
}

export default useCustomers;