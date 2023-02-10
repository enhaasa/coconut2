import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import tools from '../tools';
import gsap from 'gsap';
import animations from '../animations';

import stopwatchIcon from './../assets/icons/stopwatch-white.png';
import unPaidTabIcon from './../assets/icons/unPaidTab.png';

export default function Table(props) {
    const { orders, table, customers, maxDeliveryTime, setSelectedTable } = props;
    const { getFirstName, getLastNames, getTimeSinceOldestOrder, getOldestOrder, formatTime } = tools;

    const TableRef = useRef();
    useLayoutEffect(() => {
        gsap.from(TableRef.current, animations.appearY);

        return () => {
            gsap.to(TableRef.current, animations.appearY);
        }
    }, []);

    const tablenumberColor = () => {
        if (table.isAvailable && !table.isReserved) return "constructive";
        if (!table.isAvailable) return "destructive";
        if (table.isReserved) return "progressive";
    }

    const notificationColor = () => {
        if (!timeSinceLastOrder) return "progressive";
        if (timeSinceLastOrder <= maxDeliveryTime) return "progressive";
        if (timeSinceLastOrder > maxDeliveryTime) return "destructive";
    }

    let noBlankNames = customers.filter((customer) => (
        customer.table === table.id &&
            customer.name !== ""
    ))
    let blankNames = customers.filter((customer) => (
        customer.table === table.id && 
            customer.floor === table.floor &&
                customer.name === ""
    ))

    const maxPreview = 2;
    let exceedingMaxPreview = noBlankNames.filter((customer, index) => (
        index >= maxPreview
    ))

    const totalAdditions = exceedingMaxPreview.length + blankNames.length;

    const customersInTable = customers.filter(customer => (
        customer.table === table.id
    ))
        
    let deliveredOrdersInTable = [];
    let undeliveredOrdersInTable = [];
    const customerIds = customersInTable.map(c => c.id);
    orders.forEach(order => {
        if (customerIds.includes(order.customer)) {
            if (order.delivered) {
                deliveredOrdersInTable.push(order);
            } else {
                undeliveredOrdersInTable.push(order);
            }
        }
    });

    
    const [ timeSinceLastOrder, setTimeSinceLastOrder ] = useState(getTimeSinceOldestOrder(getOldestOrder(undeliveredOrdersInTable)));

    useEffect(() => {
        //Not the most elegant solution but will make sure timers start at 0 from first second
        setTimeSinceLastOrder(getTimeSinceOldestOrder(getOldestOrder(undeliveredOrdersInTable))); 

        const timer = setInterval(() => {
            undeliveredOrdersInTable.length > 0 &&
                setTimeSinceLastOrder(getTimeSinceOldestOrder(getOldestOrder(undeliveredOrdersInTable)));
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
                key={table.id}
                style={{
                    left:table.posX, 
                    top:table.posY
            }}>

                {table.waiter !== "" &&
                    <div className={`waiter waiterContainer`}>
                    
                    {getFirstName(table.waiter)}
                </div>}

                {false &&
                    <div className="editing">
                        <p className="dots"><span>&bull;</span><span>&bull;</span><span>&bull;</span></p>
                    </div>}

            

                <button 
                    className={`numberDisplay ${tablenumberColor()}`}
                    onClick={() => {setSelectedTable(table.id)}}>

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
                                {formatTime(timeSinceLastOrder)}
                            </div>
                        </div>
                        }

                    <span className="number">
                        {table.id + 1}
                    </span>
                
                </button>

                <div className="customers">
                    <ul>
                        {noBlankNames.map((customer, index) => ( 
                            index < maxPreview &&
                                <li key={customer.id}>{`${getFirstName(customer.name)} ${getLastNames(customer.name).join("").charAt(0)}`}</li>
                        ))}
                        {totalAdditions > 0 && <li>+{totalAdditions}</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}