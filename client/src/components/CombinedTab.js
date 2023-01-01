import React, { useState } from 'react';
import tools from '../tools';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';

export function CombinedTab(props) {

    console.log(props.deliveredOrdersInTable);

    return( 
        <>
            <table className="itemTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Total</th>
                    </tr>
                </thead>
            
                {tools.sortArray(props.deliveredOrdersInTable, true).map(order => ( 
                            <tbody>
                                <tr>
                                    <td>{order.name}</td>
                                    <td>{order.price.toLocaleString("en-US")} gil</td>
                                    <td>{order.amount}</td>
                                    <td>{order.total.toLocaleString("en-US")} gil</td>
                                </tr>
                            </tbody>
                ))}
            </table>
        </>
        
    );
}
