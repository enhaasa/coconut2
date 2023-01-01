import React, { useState } from 'react';
import tools from '../tools';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';

export function SplitTab(props) {

//tools.sortArrayByCustomer(props.deliveredOrdersInTable, true).reduce((total, order) => (total + order.price), 0).toLocaleString("en-US") + " gil"

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

                    <tbody>
                        {tools.sortArrayByCustomer(props.deliveredOrdersInTable, true).map(order => (  
                            order.customer === customer.id &&   
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
                        ))}
                    </tbody>

                    <tfoot>
                    <tr>
                        <td>Total:</td>
                        <td></td>
                        <td></td>
                        <td>{
                            props.deliveredOrdersInTable.map(order => (
                                customer.id === order.customer && order.price
                            )).reduce(((total, order) => total + order), 0).toLocaleString("en-US") + " gil"
                        }</td>
                    </tr>
                </tfoot>
                </table>
            </>
        ))
    )
}

