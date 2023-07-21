import React from 'react';
import Order from './Order';
import uuid from 'react-uuid';

export default function SplitTab(props) {
    const { 
        customersInSeating,
        deliveredOrdersInSeating,
    } = props;

    function parseOrderList(list) {
        let parsedDeliveredOrders = [];
        list.forEach(order => {
    
            const currentOrder = parsedDeliveredOrders.find(parsedOrder => parsedOrder.name === order.name && parsedOrder.price === order.price);
    
            if (!currentOrder) {
                parsedDeliveredOrders.push({
                    amount: 1,
                    name: order.name,
                    item: order.item,
                    price: order.price,
                    total: order.price,
                    units: [order]
                })
            } else {
                currentOrder.amount += 1;
                currentOrder.total += order.price;
                currentOrder.units.push(order);
            }
        });

        return parsedDeliveredOrders;
    }

    return( 
        customersInSeating.map(customer => (
            <div key={uuid()}>
                <span className="name">{customer.name}</span>
                <table className="itemTable" >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {parseOrderList(customer.deliveredOrders).map(order => (   
                                <Order 
                                    key={uuid()}
                                    order={order} 
                                /> 
                        ))}
                    </tbody>

                    <tfoot>
                        <tr>
                            <td>Total:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{
                                customer.deliveredOrders.reduce(((total, order) => total + order.price), 0).toLocaleString("en-US") + " gil"
                            }</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        ))
    )
}

