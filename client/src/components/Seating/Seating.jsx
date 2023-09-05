import React, { useRef, useEffect, useState, useLayoutEffect, useContext, useMemo } from 'react';

//Components
import ServiceInfo from './_ServiceInfo';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';
import { StaticDataContext } from '../../api/StaticData';

//Animations
import gsap from 'gsap';
import animations from '../../animations';

//Tools
import { 
    getFirstName, 
    getLastNames,
} from '../../utils/names';
import {
    formatTime,
} from '../../utils/time';
import uuid from 'react-uuid';
import PlaySound from '../../utils/PlaySound.ts';

//Icons
import stopwatchIconBlack from './../../assets/icons/stopwatch-black.png';
import orderIcon from './../../assets/icons/order-small-white.png';
import cameraIcon from './../../assets/icons/camera.png';
import waiterIcon from './../../assets/icons/waiter.png';
import userIcon from './../../assets/icons/user-white.png';

export default function Seating(props) {
    const { 
        seating, 
    } = props;
    
    const {
        customers,
        seatings,
        orders,
        localSettings,
    } = useContext(DynamicDataContext);

    const {
        itemInMovement,
        setSelectedSeating, 
        handleContextMenu,
        setItemInMovement,
    } = useContext(ControlStatesContext);

    const {
        MAX_DELIVERY_TIME,
        MAX_NAME_PREVIEW
    } = useContext(StaticDataContext);

    const isMoving = itemInMovement && itemInMovement.item.id === seating.id;
    const { getSeatingNumberColor } = seatings.utils;

    const [
        uncompletedServices,
        undeliveredOrders,
        deliveredOrders,
        completedServices,
    ] = useMemo(() => {
        const extractOrders = (ordersArray, customerProperty) =>
            ordersArray.reduce((acc, customer) => [...acc, ...customer[customerProperty]], []);
    
        const undeliveredOrders = extractOrders(seating.customers, 'undeliveredOrders');
        const deliveredOrders = extractOrders(seating.customers, 'deliveredOrders');
        const uncompletedServices = extractOrders(seating.customers, 'uncompletedServices');
        const completedServices = extractOrders(seating.customers, 'completedServices');
    
        return [uncompletedServices, undeliveredOrders, deliveredOrders, completedServices];
    });
    
    const SeatingRef = useRef();
    useLayoutEffect(() => {
        gsap.from(SeatingRef.current, animations.appearY);

        return () => {
            gsap.to(SeatingRef.current, animations.appearY);
        }
    }, []);

    const [noBlankNames, blankNames] = useMemo(() => {
        const filteredCustomers = customers.get.filter(customer => customer.seating_id === seating.id);
        const noBlank = filteredCustomers.filter(customer => customer.name.length !== 0);
        const blank = filteredCustomers.filter(customer => customer.name.length === 0);
        
        return [noBlank, blank]; 
      }, [customers.get, seating.id]);


    let exceedingMaxPreview = noBlankNames.filter((_, index) => (
        index >= MAX_NAME_PREVIEW
    ))

    const totalAdditions = exceedingMaxPreview.length + blankNames.length;

    function handleClick() {
        if (itemInMovement && itemInMovement.type === 'customer') {
            const { moveFunction } = itemInMovement;
            moveFunction(itemInMovement.item, seating.id);
            setItemInMovement(null);
        } else {
            setSelectedSeating(seating);
        }
    }

    const [ timeSinceLastOrder, setTimeSinceLastOrder ] = useState(0);
    
    useEffect(() => {
        //Not the most elegant solution but will make sure timers start at 0 from first second
        setTimeSinceLastOrder(orders.utils.getTimeSinceOldestOrder(orders.utils.getOldestOrder(undeliveredOrders))); 
    
        const timer = setInterval(() => {
            if (undeliveredOrders.length > 0) {
                const oldestOrder = orders.utils.getOldestOrder(undeliveredOrders);
                const currentTime = Date.now();
                const timeSinceOldestOrder = currentTime - oldestOrder.time;
        
                setTimeSinceLastOrder(timeSinceOldestOrder);

                const watchSettings = localSettings.watchedSeatings.find(ws => ws.id === seating.id);

                // Guard clause: Is table watched?
                if (!watchSettings || !watchSettings.triggers.includes('orders')) return;

                // Guard clause: Has max delivery time been passed?
                if (timeSinceOldestOrder > MAX_DELIVERY_TIME) return;

                // Guard clause: Has at least one minute since last ping?
                if ((timeSinceOldestOrder % 60000) > 1000) return;

                PlaySound.lateOrder();
            }
        }, 1000);
        
        return () => {
            clearInterval(timer);
        };
        
    }, [ undeliveredOrders, uncompletedServices ]);

    function getOrderNotificationColor() {
        if (!timeSinceLastOrder) return 'progressive';
        if (timeSinceLastOrder <= MAX_DELIVERY_TIME) return 'progressive';
        if (timeSinceLastOrder > MAX_DELIVERY_TIME) {
            return 'destructive';
        }
    };

    function handleMoveSeating() {
        setItemInMovement({
            type: 'seating', 
            item: seating,
            moveFunction: seatings.setLocation
        });
    }

    const contextMenuTitle = `Seating ${seating.number}`;
    const contextMenuOptions = [
        {
            name: 'Move',
            clickEvent: handleMoveSeating
        },
    ];
    
    return (   
        <div 
            className={`Seating ${isMoving && 'transparent ghost'}`}
            ref={SeatingRef}
            key={`table${seating.number}`}
            style={{
                left:seating.pos_x, 
                top:seating.pos_y
        }}>

            <div className='upper-wrapper'>
                {seating.waiter !== '' &&
                    <div className={`waiter`}>
                        <img src={waiterIcon} alt='Waiter Icon'/> 
                        {getFirstName(seating.waiter)}
                    </div>
                }

                <div className='item-category order'>
                    {undeliveredOrders.length > 0 && (
                        <div className='item'>
                            <div className={`amount`}>
                                <img src={orderIcon} alt='Order Icon' />
                                {undeliveredOrders.length}
                            </div>

                            <div className={`time ${getOrderNotificationColor()}`}>
                                <img src={stopwatchIconBlack} alt='Stopwatch Icon' />
                                {formatTime(timeSinceLastOrder)}
                            </div>
                        </div>
                    )}
                </div>

                <div className='item-category service'>
                    {uncompletedServices.length > 0 && (
                        uncompletedServices.map(service => (
                            <ServiceInfo service={service} key={uuid()} />
                        ))
                    )}
                </div>
            </div>
            
            {false &&
                <div className='editing'>
                    <p className='dots'><span>&bull;</span><span>&bull;</span><span>&bull;</span></p>
                </div>}

            <button 
                className={`number-display ${getSeatingNumberColor(seating)}`}
                onClick={handleClick}
                onContextMenu={(event) => handleContextMenu(event, contextMenuOptions, contextMenuTitle)}
                >

                <div className='is-photography-container'>
                    <span className='is-photography'>
                        {seating.is_photography && 
                            <div className=''>
                                <img src={cameraIcon} alt='Camera Icon' /> 
                            </div>}
                    </span>
                </div>
                
                <span className='number'>
                    {seating.number}
                </span>
            </button>

            <div className='lower-wrapper'>
                    { 
                        noBlankNames.length + totalAdditions > 0 &&   
                        <div className='customers'>
                                <div className='customer'>
                                    <img src={userIcon} alt='Customer Icon'/>
                                    {noBlankNames.length > 0 
                                        ? `${getFirstName(noBlankNames[0].name)} ${getLastNames(noBlankNames[0].name).join('').charAt(0)}
                                            ${totalAdditions > 0 ? `+${totalAdditions}` : ''}`
                                        : `${totalAdditions > 0 ? totalAdditions : ''}`}
                                </div>
                        </div>
                    }
                    {(deliveredOrders.length > 0 || completedServices.length > 0) && (
                     <div className='unpaid-orders'>Tab Available</div>
                    )}
            </div>
        </div>
    );
}