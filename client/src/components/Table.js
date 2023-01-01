import React, { useRef, useEffect, useState } from 'react';
import tools from '../tools';

import stopwatchIcon from './../assets/icons/stopwatch-white.png';

export function Table(props) {

    const tablenumberColor = () => {
        if (props.table.isAvailable && !props.table.isReserved) return "constructive";
        if (!props.table.isAvailable) return "destructive";
        if (props.table.isReserved) return "progressive";
    }

    const notificationColor = () => {
        if (!timeSinceLastOrder) return "progressive";
        if (timeSinceLastOrder <= props.maxDeliveryTime) return "progressive";
        if (timeSinceLastOrder > props.maxDeliveryTime) return "destructive";
    }

    let noBlankNames = props.customers.filter((customer) => (
        customer.table === props.table.id &&
            customer.name !== ""
    ))

    let blankNames = props.customers.filter((customer) => (
        customer.table === props.table.id && 
            customer.floor === props.table.floor &&
                customer.name === ""
    ))

    const maxPreview = 2;
    let exceedingMaxPreview = noBlankNames.filter((customer, index) => (
        index >= maxPreview
    ))

    const totalAdditions = exceedingMaxPreview.length + blankNames.length;

    const customersInTable = props.customers.filter(customer => (
        customer.table === props.table.id
    ))
        
    let undeliveredOrdersInTable = [];
    customersInTable.forEach(customer => {
        props.orders.forEach(order => {
            !order.delivered &&
                customer.id === order.customer && 
                undeliveredOrdersInTable.push(order);
        })
    });
    
    const [ timeSinceLastOrder, setTimeSinceLastOrder ] = useState(tools.getTimeSinceOldestOrder(tools.getOldestOrder(undeliveredOrdersInTable)));

    useEffect(() => {
        //Not the most elegant solution but will make sure timers start at 0 from first second
        setTimeSinceLastOrder(tools.getTimeSinceOldestOrder(tools.getOldestOrder(undeliveredOrdersInTable))); 

        const timer = setInterval(() => {
            undeliveredOrdersInTable.length > 0 &&
                setTimeSinceLastOrder(tools.getTimeSinceOldestOrder(tools.getOldestOrder(undeliveredOrdersInTable)));
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [undeliveredOrdersInTable]);

    return (
        <div>          
            <div 
                className={`Table`}
                key={props.table.id}
                style={{
                    left:props.table.posX, 
                    top:props.table.posY
            }}>

                {props.table.waiter !== "" &&
                    <div className={`waiter waiterContainer`}>
                    
                    {tools.getFirstName(props.table.waiter)}
                </div>}

                <button 
                    className={`numberDisplay ${tablenumberColor()}`}
                    onClick={() => {props.setSelectedTable(props.table.id)}}>

                    {undeliveredOrdersInTable.length > 0 && 
                        <div className="notificationContainer">
                            <div className={`notification ${notificationColor()}`}>
                                {undeliveredOrdersInTable.length}
                            </div>

                            <div className="addendum">
                                <img src={stopwatchIcon} />
                                {tools.formatTime(timeSinceLastOrder)}
                            </div>
                        </div>
                        }

                    <span className="number">
                        {props.table.id + 1}
                    </span>
                
                </button>

                <div className="customers">
                    <ul>
                        {noBlankNames.map((customer, index) => ( 
                            index < maxPreview &&
                                <li key={customer.id}>{tools.toInitialsFirstNames(customer.name)}</li>
                        ))}
                        {totalAdditions > 0 && <li>+{totalAdditions}</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}