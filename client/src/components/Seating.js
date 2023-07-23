import React, { useRef, useEffect, useState, useLayoutEffect, useContext, useMemo } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import { ControlStatesContext } from '../api/ControlStates';
import { StaticDataContext } from '../api/StaticData';
import tools from '../tools';
import gsap from 'gsap';
import animations from '../animations';

import stopwatchIcon from './../assets/icons/stopwatch-black.png';
import unPaidTabIcon from './../assets/icons/unPaidTab.png';
import orderIcon from './../assets/icons/order-small-white.png';
import cameraIcon from './../assets/icons/camera.png';
import waiterIcon from './../assets/icons/waiter.png';
import userIcon from './../assets/icons/user-white.png';

export default function Seating(props) {
    const { 
        seating, 
    } = props;
    const {
        customers,
    } = useContext(DynamicDataContext);
    const {
        itemInMovement,
        setSelectedSeating, 
    } = useContext(ControlStatesContext);
    const {
        MAX_DELIVERY_TIME,
        MAX_NAME_PREVIEW
    } = useContext(StaticDataContext);


    const { getFirstName, getLastNames, getTimeSinceOldestOrder, getOldestOrder, formatTime } = tools;

    const isMoving = itemInMovement && itemInMovement.id === seating.id;

    let undeliveredOrders = [];
    let deliveredOrders = [];

    seating.customers.forEach(customer => {
        customer.undeliveredOrders.forEach(order => {
            undeliveredOrders.push(order);
        })
        customer.deliveredOrders.forEach(order => {
            deliveredOrders.push(order);
        })
    });

    const SeatingRef = useRef();
    useLayoutEffect(() => {
        gsap.from(SeatingRef.current, animations.appearY);

        return () => {
            gsap.to(SeatingRef.current, animations.appearY);
        }
    }, []);

    function seatingnumberColor() {
        if (seating.is_available && !seating.is_reserved) return "constructive";
        if (!seating.is_available) return "destructive";
        if (seating.is_reserved) return "progressive";
    }

    const [noBlankNames, blankNames] = useMemo(() => {
        const filteredCustomers = customers.get.filter(customer => customer.seating_id === seating.id);
        const noBlank = filteredCustomers.filter(customer => customer.name.length !== 0);
        const blank = filteredCustomers.filter(customer => customer.name.length === 0);
        
        return [noBlank, blank]; 
      }, [customers.get, seating.id]);


    let exceedingMaxPreview = noBlankNames.filter((customer, index) => (
        index >= MAX_NAME_PREVIEW
    ))

    const totalAdditions = exceedingMaxPreview.length + blankNames.length;

    function handleSetSelectedSeating(selectedSeating) {
        setSelectedSeating(selectedSeating);
    }

    const [ timeSinceLastOrder, setTimeSinceLastOrder ] = useState(0);
    
    useEffect(() => {
        //Not the most elegant solution but will make sure timers start at 0 from first second
        setTimeSinceLastOrder(getTimeSinceOldestOrder(getOldestOrder(undeliveredOrders))); 
    
        const timer = setInterval(() => {
            undeliveredOrders.length > 0 &&
                setTimeSinceLastOrder(getTimeSinceOldestOrder(getOldestOrder(undeliveredOrders)));
        }, 1000);
    
        return () => {
            clearInterval(timer);
        };
    }, [undeliveredOrders]);

    function getNotificationColor() {
        if (!timeSinceLastOrder) return "progressive";
        if (timeSinceLastOrder <= MAX_DELIVERY_TIME) return "progressive";
        if (timeSinceLastOrder > MAX_DELIVERY_TIME) return "destructive";
    };

    return (
        <div>          
            <div 
                className={`Seating ${isMoving && "transparent ghost"}`}
                ref={SeatingRef}
                key={`table${seating.number}`}
                style={{
                    left:seating.pos_x, 
                    top:seating.pos_y
            }}>

                <div className="upper-wrapper">
                    {seating.waiter !== "" &&
                        <div className={`waiter`}>
                            <img src={waiterIcon} alt="Waiter Icon"/> 
                            {getFirstName(seating.waiter)}
                        
                        </div>
                    }

                    <div className="orderinfo">
                        {undeliveredOrders.length > 0 && (
                            <>
                            <div className={`amount`}>
                                <img src={orderIcon} alt="Order Icon" />
                                {undeliveredOrders.length}
                            </div>

                            <div className={`time ${getNotificationColor()}`}>
                                <img src={stopwatchIcon} alt="Stopwatch Icon" />
                                {formatTime(timeSinceLastOrder)}
                            </div>
                            </>
                        )}
                    </div>
                </div>
                
                {false &&
                    <div className="editing">
                        <p className="dots"><span>&bull;</span><span>&bull;</span><span>&bull;</span></p>
                    </div>}

                <button 
                    className={`number-display ${seating.type} ${seatingnumberColor()}`}
                    onClick={() => {handleSetSelectedSeating(seating)}}>

                    <div className="is-photography-container">
                        <span className="is-photography">
                            {seating.is_photography ? 
                            
                                <div className="">
                                    <img src={cameraIcon} alt="Camera Icon" /> 
                                </div>
                                : ""}
                        </span>
                    </div>
                    
                    <div className="unpaid-tab-container ">
                        <span className="unpaid-tab">
                            {deliveredOrders.length > 0 ? 
                            
                                <div className="">
                                    <img src={unPaidTabIcon} alt="Unpaid Tab Icon" /> 
                                </div>
                                : ""}
                        </span>
                    </div>
                    
                    <span className="number">
                        {seating.number}
                    </span>
                </button>

                <div className="lower-wrapper">
                    <div className="customers">
                        {noBlankNames.map((customer, index) => ( 
                            index < MAX_NAME_PREVIEW &&
                                <div className="customer" key={customer.id}>
                                    <img src={userIcon} alt="Customer Icon"/>
                                    {`${getFirstName(customer.name)} ${getLastNames(customer.name).join("").charAt(0)}`}
                                </div>
                        ))}
                        {totalAdditions > 0 && 
                            <div className="customer">+ {totalAdditions} 
                            <img src={userIcon} alt="Customer Icon"/>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
}