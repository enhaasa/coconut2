import React, { useRef, useEffect, useState, useLayoutEffect, useContext, useMemo } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import tools from '../tools';
import gsap from 'gsap';
import animations from '../animations';

import stopwatchIcon from './../assets/icons/stopwatch-white.png';
import unPaidTabIcon from './../assets/icons/unPaidTab.png';
import cameraIcon from './../assets/icons/camera.png';
import waiterIcon from './../assets/icons/waiter.png';

export default function Seating(props) {
    const { seating, maxDeliveryTime, setSelectedSeating } = props;
    const {
        orders,
        customers,
    } = useContext(DynamicDataContext);

    const { getFirstName, getLastNames, getTimeSinceOldestOrder, getOldestOrder, formatTime } = tools;

    const NAME_PREVIEW__MAX_AMOUNT = 2;

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

    const seatingnumberColor = () => {
        if (seating.is_available && !seating.is_reserved) return "constructive";
        if (!seating.is_available) return "destructive";
        if (seating.is_reserved) return "progressive";
    }

    const notificationColor = () => {
        if (!timeSinceLastOrder) return "progressive";
        if (timeSinceLastOrder <= maxDeliveryTime) return "progressive";
        if (timeSinceLastOrder > maxDeliveryTime) return "destructive";
    }

    const [noBlankNames, blankNames] = useMemo(() => {
        const filteredCustomers = customers.get.filter(customer => customer.seating_id === seating.id);
        const noBlank = filteredCustomers.filter(customer => customer.name.length !== 0);
        const blank = filteredCustomers.filter(customer => customer.name.length === 0);
        
        return [noBlank, blank]; 
      }, [customers.get, seating.id]);


    let exceedingMaxPreview = noBlankNames.filter((customer, index) => (
        index >= NAME_PREVIEW__MAX_AMOUNT
    ))

    const totalAdditions = exceedingMaxPreview.length + blankNames.length;

    function handleSetSelectedSeating(selectedSeating) {
        setSelectedSeating(selectedSeating);
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
                ref={SeatingRef}
                key={`table${seating.number}`}
                style={{
                    left:seating.pos_x, 
                    top:seating.pos_y
            }}>

                {seating.waiter !== "" &&
                    <div className={`waiter waiterContainer`}>
                    <img src={waiterIcon} alt="Waiter Icon"/> 
                    {getFirstName(seating.waiter)}
                    
                </div>}

                {false &&
                    <div className="editing">
                        <p className="dots"><span>&bull;</span><span>&bull;</span><span>&bull;</span></p>
                    </div>}

            

                <button 
                    className={`numberDisplay ${seatingnumberColor()}`}
                    onClick={() => {handleSetSelectedSeating(seating)}}>

                    {
                        <div className="isPhotographyContainer">
                        <span className="isPhotography">
                            {seating.is_photography ? 
                            
                                <div className="">
                                    <img src={cameraIcon} alt="Camera Icon" /> 
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
                                <img src={stopwatchIcon} alt="Stopwatch Icon"/>
                                {formatTime(timeSinceLastOrder)}
                            </div>
                        </div>
                        }

                    <span className="number">
                        {seating.number}
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