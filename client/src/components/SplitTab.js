import React, { useState } from 'react';
import tools from '../tools';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';

export default function SplitTab(props) {
    const { 
        customersInTable,
        deliveredOrdersInTable,
        orders
    } = props;

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
                        {tools.sortArrayByCustomer(deliveredOrdersInTable, true).map(order => (  
                            order.customer === customer.id &&   
                                <tr key={order.id}>
                                    <td>{order.name}</td>
                                    <td>{order.price.toLocaleString("en-US")} gil</td>
                                    <td>{order.amount}</td>
                                    <td>{order.total.toLocaleString("en-US")} gil</td>
        
                                    <td className="tableNav">
                                        <button className="icon" onClick={() => {orders.remove(order.ids[order.ids.length -1])}}>
                                            <img src={minusIcon} alt="" />
                                        </button>
                                        <button className="icon" onClick={() => {orders.add({...order, delivered: true})}}>
                                            <img src={plusIcon} alt="" />
                                        </button>
                                    </td>
                                </tr>  
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

