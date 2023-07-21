import { useState } from 'react';
import useSocketListener from './../useSocketListener';

function useOrders(init, props) {
    const {
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

        removeAllOrdersFromSeating: (seating) => {
            setOrders(prev => (
                prev.filter(order => order.seating_id !== seating.id)
            ));
        },

        removeAllDeliveredOrdersFromSeating: (seating) => {
            setOrders(prev => {
                const fileteredOrders = prev.filter(order => !order.is_delivered || order.seating_id !== seating.id);
                return fileteredOrders;
            });
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
    

    function remove(order) {
        socket.emit("removeOrder", { ...order });
    }

    function pay(orders, seating) {
        socket.emit('payOrdersInSeating', {orders, seating});
    }


    function deliver(order) {
        socket.emit('deliverOrder', { ...order});
    }


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
        }
    ];
}


export default useOrders;