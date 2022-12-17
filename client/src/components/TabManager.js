import React, { useState } from 'react';
import tools from '../tools';

import closeIcon from './../assets/icons/close.png';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';

export function TabManager(props) {

    const [isBlurred, setIsBlurred] = useState(false);

    const close = () => {
        props.handleViewTab(false);
    }

    return(
        <div className="TabManagerContainer">
            {isBlurred && <div className="blur"></div>}

            <section className="TabManager">

                <header>
                    <span className="title cursive">Tab</span>
                    <button className="closeButton" onClick={close}>
                        <img src={closeIcon} alt="" />
                    </button>
                </header>
                
                {props.customersInTable.map(customer => (
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
                    
                        {tools.sortArray(props.deliveredOrdersInTable, true).map(order => (  
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
                ))}

                <nav>
                    <button className="payButton constructive" onClick={() => {props.payOrders(props.deliveredOrdersInTable.map(order => order.id))}}>Pay & Archive</button>
                </nav>

            </section>
        </div>
    )
}