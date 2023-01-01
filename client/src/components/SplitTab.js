import React, { useState } from 'react';
import tools from '../tools';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';

export function SplitTab(props) {
    return( 
        props.customersInTable.map(customer => (
            <>
                <span className="name">{customer.name}</span>
                <table className="itemTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                
                    {tools.sortArrayByCustomer(props.deliveredOrdersInTable, true).map(order => (  
                        order.customer === customer.id && 
                                <tbody>
                                    <tr>
                                        <td>{order.name}</td>
                                        <td>{order.price.toLocaleString("en-US")} gil</td>
                                        <td>{order.amount}</td>
                                        <td>{order.total.toLocaleString("en-US")} gil</td>
            
                                        <nav className="tableNav">
                                            <button className="icon" onClick={() => {props.removeOrder(order.ids[order.ids.length -1])}}>
                                                <img src={minusIcon} alt="" />
                                            </button>
                                            <button className="icon" onClick={() => {props.addOrder({...order, delivered: true})}}>
                                                <img src={plusIcon} alt="" />
                                            </button>
                                        </nav>
                                    </tr>
                                </tbody>
                    ))}
                </table>
            </>
        ))
    )
}

