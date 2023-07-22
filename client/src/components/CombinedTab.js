import React from "react";
import uuid from "react-uuid";

export default function CombinedTab(props) {

    const { deliveredOrdersInSeating } = props;
    
    let parsedDeliveredOrders = [];
    deliveredOrdersInSeating.forEach(order => {

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


    return( 
        <>
            <table className="item-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Total</th>
                    </tr>
                </thead>
            
                <tbody>
                    {parsedDeliveredOrders.map(order => ( 
                                
                        <tr key={uuid()}>
                            <td>{order.name}</td>
                            <td>{order.price.toLocaleString("en-US")} gil</td>
                            <td>{order.amount}</td>
                            <td>{order.total.toLocaleString("en-US")} gil</td>
                        </tr>
                                
                    ))}
                </tbody>

                <tfoot>
                    <tr>
                        <td>Total:</td>
                        <td></td>
                        <td></td>
                        <td>{deliveredOrdersInSeating.reduce((total, order) => (total + order.price), 0).toLocaleString("en-US") + " gil"}</td>
                    </tr>
                </tfoot>
            </table>
        </>
        
    );
}
