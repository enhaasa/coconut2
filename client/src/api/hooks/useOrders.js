import { useState } from 'react';
import useSocketListener from './../useSocketListener';

export default function useOrders(init, props) {
    const {
        socket
    } = props;

    const [ orders, setOrders ] = useState(init);
    const eventHandlers = {
        getOrders: (items) => {
            setOrders(items);
        },
        
        addOrder: (order) => {
            setOrders(prev => ([...prev, order]));
        },
        
        removeOrder: (ordertoRemove) => {
            setOrders(prev => (
                prev.filter(order => (
                    order.id !== ordertoRemove.id
                ))
            ));
        },

        removeAllOrdersFromSeating: (seating) => {
            setOrders(prev => (
                prev.filter(order => order.seating_id !== seating.id)
            ));
        },

        removeAllOrdersByCustomer: (customer) => {
            setOrders(prev => (
                prev.filter(order => order.customer_id !== customer.id)
            ));
        },
        removeAllDeliveredOrdersFromSeating: (seating) => {
            setOrders(prev => {
                const fileteredOrders = prev.filter(order => !order.is_delivered || order.seating_id !== seating.id);
                return fileteredOrders;
            });
        },

        setOrderAttributes: (data) => {
            const { order, attributes } = data;
            const index = orders.findIndex(c => c.id === order.id);

            setOrders(prev => {
                attributes.forEach(a => {
                    prev[index][a[0]] = a[1];
                });

                return [...prev];
            });
        },

        setOrdersAttributes: (data) => {
            const { key, value, attributes } = data;

            setOrders(prev => {
                prev.forEach(item => {
                    if (item[key] === value) {
                        attributes.forEach(a => {
                            item[a[0]] = a[1];
                        });
                    }
                })

                return [...prev];
            });
        },

        deliverOrder: (orderToDeliver) => {
            setOrders(prev => {
                const index = orders.findIndex(order => order.id === orderToDeliver.id);

                prev[index].is_delivered = true;
                return [...prev];
            })
        },

        deliverAllOrdersByCustomer: (customer) => {
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
    function add(order, requestID) {
        socket.emit('addOrder', { order, requestID });
    }
    

    function remove(order) {
        socket.emit('removeOrder', { ...order });
    }

    function pay(orders, seating, requestID) {
        console.log('Orders: ', orders);
        console.log('Seating:', seating)
        socket.emit('payOrdersInSeating', { orders, seating, requestID });
    }


    function deliver(order, requestID) {
        socket.emit('deliverOrder', { order, requestID });
    }


    function deliverAllByCustomer(customer, requestID) {
        socket.emit('deliverAllByCustomer', { ...customer, requestID });
    }

    function refresh() {
        socket.emit('getOrders');
    }

    return {
        get: orders,
        add,
        remove,
        deliver,
        deliverAllByCustomer,
        refresh,
        pay,
    }
    
}