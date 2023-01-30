import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import tools from '../tools';
import gsap from 'gsap';
import animations from '../animations';

import stopwatchIcon from './../assets/icons/stopwatch-white.png';
import unPaidTabIcon from './../assets/icons/unPaidTab.png';

export function Table(props) {

    const TableRef = useRef();
    useLayoutEffect(() => {
        gsap.from(TableRef.current, animations.appearY);

        return () => {
            gsap.to(TableRef.current, animations.appearY);
        }
    }, []);

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
        
    let deliveredOrdersInTable = [];
    let undeliveredOrdersInTable = [];
    const customerIds = customersInTable.map(c => c.id);
    props.orders.forEach(order => {
        if (customerIds.includes(order.customer)) {
            if (order.delivered) {
                deliveredOrdersInTable.push(order);
            } else {
                undeliveredOrdersInTable.push(order);
            }
        }
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
                ref={TableRef}
                key={props.table.id}
                style={{
                    left:props.table.posX, 
                    top:props.table.posY
            }}>

                {props.table.waiter !== "" &&
                    <div className={`waiter waiterContainer`}>
                    
                    {tools.getFirstName(props.table.waiter)}
                </div>}

                {false &&
                    <div className="editing">
                        <p className="dots"><span>&bull;</span><span>&bull;</span><span>&bull;</span></p>
                    </div>}

            

                <button 
                    className={`numberDisplay ${tablenumberColor()}`}
                    onClick={() => {props.setSelectedTable(props.table.id)}}>

                    {
                        <div className="unPaidTabContainer">
                            <span className="unPaidTab">
                                {deliveredOrdersInTable.length > 0 ? 
                                
                                    <div className="">
                                        <img src={unPaidTabIcon} /> 
                                    </div>
                                    : ""}
                            </span>
                        </div>
                    }


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