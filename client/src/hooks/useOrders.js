import { useState } from 'react';
import db from '../dbTools_client';
import uuid from 'react-uuid';
import { nanoid } from 'nanoid';
import tools from '../tools';

function useOrders(init, props) {

    const {
        updateUpdates,
        tables
    } = props;

    const [ orders, setOrders ] = useState(init);

    /**
     * Add a new order to the orders array.
     * 
     * @param {object} order - An order object to insert into the orders array.
     */
    function add(order) {
        const filteredOrder = {
            customer: order.customer,
            customerName: order.customerName,
            delivered: order.delivered,
            floor: order.floor,
            table: order.table,
            name: order.name,
            paid: order.paid,
            price: order.price,
            time: order.time,
            date: order.date,
            item: order.item,
            type: order.type,
            id: uuid()
        }

        
    
        setOrders(prev => ([...prev, filteredOrder]));
        db.orders.post(filteredOrder);
        updateUpdates("orders");
    }
    

    /**
     * Remove a new order to the orders array.
     * 
     * @param {string} id - The id of the order to remove from the orders array.
     */
    function remove(id) {
    
        setOrders(prev => (
            prev.filter(order => (
                order.id !== id
            ))
        ));
        
        db.orders.delete(id);
        updateUpdates("orders");
    }

    /**
     * Remove all undelivered orders related to a specific customer.
     * 
     * @param {string} customer - The customer id of which all undelivered orders should be removed.
     */
    function removeAllUndelivered(customer) {
        orders.forEach(order => {
            order.customer === customer && 
                order.delivered === false && 
                    remove(order.id)
        })
    }

    /**
     * Remove all unpaid orders related to a specific customer.
     * 
     * @param {string} customer - The customer id of which all unpaid orders should be removed.
     */
    function removeAllUnpaid(customer) {
        orders.forEach(order => {
            order.customer === customer && 
            order.paid === false && 
                remove(order.id)
        })
    }

    function pay(order, session) {
        const filteredOrder = {
            id: order.id,
            customerName: order.customerName,
            floor: order.floor,
            name: order.name,
            table: order.table,
            price: order.price,
            type: order.type,
            session: session,
            time: order.time,
            date: tools.convertDatetimeFormat(order.date),
            item: order.item
        }
        
        db.archivedOrders.post(filteredOrder);
        remove(order.id);
        updateUpdates("archived_orders");
    }

    function payAll(ordersToPay, table, session) {
        ordersToPay.forEach(order => {
            pay(order, session);
        })

        /*
            setTables(prev => {
                prev[table].session = session;
                return [...prev];
            })
        */

        db.tables.put('session', session, 'id', table);
        updateUpdates("tables");
    }

    /**
     * Set the "delivered" property of an order to true.
     * 
     * @param {string} id - The order id of which the delivered property should be set to true.
     */
    function deliver(id) {
        const index = orders.findIndex(order => order.id === id);

        setOrders(prev => (
            [...prev, prev[index].delivered = true]
        ));

        db.orders.put('delivered', true, 'id', id);
        updateUpdates("orders");
    }

    /**
     * Set the "delivered" property to true for all orders related to a customer.
     * 
     * @param {string} customer - The customer id of which all related orders should be set to true.
     */
    function deliverAll(customer) {
        orders.forEach(order => {
            order.customer === customer && deliver(order.id)
        });
    }

    function refresh() {
        db.orders.get().then(res => {
            setOrders(res.map(item => (
            {...item,
                paid: item.paid === 1 ? true : false,
                delivered: item.delivered === 1 ? true : false
            }
            )))
        });
    }

    return [
        {
            get: orders,
            add: add,
            remove: remove,
            removeAllUndelivered: removeAllUndelivered,
            removeAllUnpaid: removeAllUnpaid,
            deliver: deliver,
            deliverAll: deliverAll,
            refresh,
            pay,
            payAll
        }
    ];
}


export default useOrders;