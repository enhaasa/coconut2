import React, { useEffect, useState } from 'react';
import tools from '../tools';

export default function CombinedTab(props) {

    const { deliveredOrdersInTable } = props;
    

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
            
                <tbody>
                    {tools.sortArray(props.deliveredOrdersInTable, true).map(order => ( 
                                
                        <tr key={order.id}>
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
                        <td>{deliveredOrdersInTable.reduce((total, order) => (total + order.price), 0).toLocaleString("en-US") + " gil"}</td>
                    </tr>
                </tfoot>
            </table>
        </>
        
    );
}
