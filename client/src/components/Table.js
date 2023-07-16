import React, { useRef, useEffect, useState, useLayoutEffect, useContext, useMemo } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import tools from '../tools';
import gsap from 'gsap';
import animations from '../animations';

import stopwatchIcon from './../assets/icons/stopwatch-white.png';
import unPaidTabIcon from './../assets/icons/unPaidTab.png';
import cameraIcon from './../assets/icons/camera.png';
import waiterIcon from './../assets/icons/waiter.png';

export default function Table(props) {
    const { table, maxDeliveryTime, setSelectedTable } = props;
    const {
        orders,
        customers,
    } = useContext(DynamicDataContext);

    const { getFirstName, getLastNames, getTimeSinceOldestOrder, getOldestOrder, formatTime } = tools;

    const NAME_PREVIEW__MAX_AMOUNT = 2;

    let undeliveredOrders = [];
    let deliveredOrders = [];

    table.customers.forEach(customer => {
        customer.undeliveredOrders.forEach(order => {
            undeliveredOrders.push(order);
        })
        customer.deliveredOrders.forEach(order => {
            deliveredOrders.push(order);
        })
    });


    /*
    const [deliveredOrders, undeliveredOrders] = useMemo(() => {
        const delivered = [];
        const undelivered = [];
      
        table.customers.forEach(customer => {
            const { orders } = customer;
            delivered.push(...orders.filter(order => order.is_delivered));
            undelivered.push(...orders.filter(order => !order.is_delivered));
        });
      
        return [delivered, undelivered];
    }, [table.customers]);*/

    const TableRef = useRef();
    useLayoutEffect(() => {
        gsap.from(TableRef.current, animations.appearY);

        return () => {
            gsap.to(TableRef.current, animations.appearY);
        }
    }, []);

    const tablenumberColor = () => {
        if (table.is_available && !table.is_reserved) return "constructive";
        if (!table.is_available) return "destructive";
        if (table.is_reserved) return "progressive";
    }

    const notificationColor = () => {
        if (!timeSinceLastOrder) return "progressive";
        if (timeSinceLastOrder <= maxDeliveryTime) return "progressive";
        if (timeSinceLastOrder > maxDeliveryTime) return "destructive";
    }

    const [noBlankNames, blankNames] = useMemo(() => {
        const filteredCustomers = customers.get.filter(customer => customer.table_id === table.id);
        const noBlank = filteredCustomers.filter(customer => customer.name.length !== 0);
        const blank = filteredCustomers.filter(customer => customer.name.length === 0);
        
        return [noBlank, blank]; 
      }, [customers.get, table.id]);


    let exceedingMaxPreview = noBlankNames.filter((customer, index) => (
        index >= NAME_PREVIEW__MAX_AMOUNT
    ))

    const totalAdditions = exceedingMaxPreview.length + blankNames.length;

    function handleSetSelectedTable(selectedTable) {
        setSelectedTable(selectedTable);
    }
    
    
    const [ timeSinceLastOrder, setTimeSinceLastOrder ] = useState(getTimeSinceOldestOrder(getOldestOrder(undeliveredOrders)));

    useEffect(() => {
        //Not the most elegant solution but will make sure timers start at 0 from first second
        setTimeSinceLastOrder(getTimeSinceOldestOrder(getOldestOrder(undeliveredOrders))); 

        const timer = setInterval(() => {
            undeliveredOrders.length > 0 &&
                setTimeSinceLastOrder(getTimeSinceOldestOrder(getOldestOrder(undeliveredOrders)));
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [undeliveredOrders]);


    return (
        <div>          
            <div 
                className={`Table`}
                ref={TableRef}
                key={`table${table.number}`}
                style={{
                    left:table.pos_x, 
                    top:table.pos_y
            }}>

                {table.waiter !== "" &&
                    <div className={`waiter waiterContainer`}>
                    <img src={waiterIcon}/> 
                    {getFirstName(table.waiter)}
                    
                </div>}

                {false &&
                    <div className="editing">
                        <p className="dots"><span>&bull;</span><span>&bull;</span><span>&bull;</span></p>
                    </div>}

            

                <button 
                    className={`numberDisplay ${tablenumberColor()}`}
                    onClick={() => {handleSetSelectedTable(table)}}>

                    {
                        <div className="isPhotographyContainer">
                        <span className="isPhotography">
                            {table.is_photography ? 
                            
                                <div className="">
                                    <img src={cameraIcon} /> 
                                </div>
                                : ""}
                        </span>
                    </div>
                    }


                    {
                        <div className="unPaidTabContainer">
                            <span className="unPaidTab">
                                {deliveredOrders.length > 0 ? 
                                
                                    <div className="">
                                        <img src={unPaidTabIcon} /> 
                                    </div>
                                    : ""}
                            </span>
                        </div>
                    }


                    {undeliveredOrders.length > 0 && 
                        <div className="notificationContainer">
                            <div className={`notification ${notificationColor()}`}>
                                {undeliveredOrders.length}
                            </div>

                            <div className="addendum">
                                <img src={stopwatchIcon} />
                                {formatTime(timeSinceLastOrder)}
                            </div>
                        </div>
                        }

                    <span className="number">
                        {table.number}
                    </span>
                
                </button>

                <div className="customers">
                    <ul>
                        {noBlankNames.map((customer, index) => ( 
                            index < NAME_PREVIEW__MAX_AMOUNT &&
                                <li key={customer.id}>{`${getFirstName(customer.name)} ${getLastNames(customer.name).join("").charAt(0)}`}</li>
                        ))}
                        {totalAdditions > 0 && <li>+{totalAdditions}</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}