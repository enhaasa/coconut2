import React from 'react';

//Components
import Order from '../Order';
import Table from '../common/Table/Table';

//Tools
import uuid from 'react-uuid';

export default function SplitTab(props) {
    const { 
        customersInSeating,
    } = props;

    function parseOrderList(list) {
        let parsedDeliveredOrders = [];
        list.forEach(order => {
    
            const currentOrder = parsedDeliveredOrders.find(parsedOrder => 
                parsedOrder.name === order.name && parsedOrder.price === order.price);
    
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
                <span className='name'>{customer.name}</span>

                <Table>
                    {parseOrderList(customer.deliveredOrders).map(order => (
                        <Order 
                            key={uuid()}
                            order={order} 
                        /> 
                    ))}
                </Table>
            </div>
        ))
    )
}

