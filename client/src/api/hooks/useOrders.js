import { useState } from 'react';
import db from '../../dbTools_client';
import tools from '../../tools';
import useSocketListener from './../useSocketListener';

function useOrders(init, props) {
    const {
        archivedSessions, 
        archivedOrders,
        socket
    } = props;

    const [ orders, setOrders ] = useState(init);
    const eventHandlers = {
        getOrders: (menu_items) => {
            setOrders(menu_items);
        },
        addOrder: (order) => {

            setOrders(prev => ([...prev, order]));
        },
        
        removeOrder: (ordertoRemove) => {
            setOrders(prev => (
                prev.filter(order => (
                    order.uuid !== ordertoRemove.uuid
                ))
            ));
        },

        removeAllOrdersFromTable: (table) => {
            setOrders(prev => (
                prev.filter(order => order.table_id !== table.id)
            ));
        },

        deliverOrder: (orderToDeliver) => {
            setOrders(prev => {
                const index = orders.findIndex(order => order.uuid === orderToDeliver.uuid);

                prev[index].is_delivered = true;
                return [...prev];
            })
        },

        deliverAllByCustomer: (customer) => {
            
            setOrders(prev => {
                prev.forEach((order, index) => {
                    if(order.customer_id === customer.id) {
                        prev[index].is_delivered = true;
                    }
                });

                return [...prev];
            });
        }
    }


    useSocketListener(socket, eventHandlers);

    /**
     * Add a new order to the orders array.
     * 
     * @param {object} order - An order object to insert into the orders array.
     */
    function add(order) {

        socket.emit("addOrder", { ...order });
    }
    

    /**
     * Remove a new order to the orders array.
     * 
     * @param {string} id - The id of the order to remove from the orders array.
     */
    function remove(order) {
        socket.emit("removeOrder", { ...order });
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
        
        archivedOrders.add(filteredOrder);
        remove(order.id);
    }

    function payAll(ordersToPay, table, session) {
        ordersToPay.forEach(order => {
            pay(order, session);
        })

        const price = ordersToPay.reduce((total, current) => total + current.price, 0);
        const { floor } = ordersToPay[0];

        const archivedSession = {
            id: session, 
            price: price,
            paidAmount: price,
            floor: floor,
            date: tools.epochToSqlDateTime(tools.getCurrentTime()),
            table: table,
        };

        //db.archivedSessions.post(archivedSession);
        archivedSessions.add(archivedSession)

        db.tables.put('session', session, 'id', table);
        //updateUpdates("archived_sessions");
    }

    /**
     * Set the "delivered" property of an order to true.
     * 
     * @param {string} id - The order id of which the delivered property should be set to true.
     */
    function deliver(order) {
        socket.emit('deliverOrder', { ...order});
    }

    /**
     * Set the "delivered" property to true for all orders related to a customer.
     * 
     * @param {string} customer - The customer id of which all related orders should be set to true.
     */
    function deliverAllByCustomer(customer) {
        socket.emit('deliverAllByCustomer', customer);
    }

    function refresh() {
        socket.emit("getOrders");
    }

    return [
        {
            get: orders,
            add: add,
            remove: remove,
            deliver: deliver,
            deliverAllByCustomer: deliverAllByCustomer,
            refresh,
            pay,
            payAll
        }
    ];
}


export default useOrders;