import React, { useState } from 'react';
import Order from './Order';
import tools from '../tools';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';

export default function SplitTab(props) {
    const { 
        customersInTable,
        deliveredOrdersInTable,
        orders
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
        customersInTable.map(customer => (
            <div key={customer.id}>
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
                                <Order order={order} /> 
                        ))}
                    </tbody>

                    <tfoot>
                    <tr>
                        <td>Total:</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{
                            deliveredOrdersInTable.map(order => (
                                customer.id === order.customer && order.price
                            )).reduce(((total, order) => total + order), 0).toLocaleString("en-US") + " gil"
                        }</td>
                    </tr>
                </tfoot>
                </table>
            </div>
        ))
    )
}

