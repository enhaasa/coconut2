import React, { useLayoutEffect, useState, useRef, useContext, useEffect }from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import { ControlStatesContext } from '../api/ControlStates';
import OrderManager from './OrderManager';
import TabManager from './TabManager';
import ConfirmBox from './ConfirmBox';
import uuid from 'react-uuid';
import { gsap } from 'gsap';
import animations from '../animations.js'

import closeIcon from './../assets/icons/close.png';
import basketIcon from './../assets/icons/shopping-cart.png';
import resetIcon from './../assets/icons/reset-black.png';

export default function SeatingManager(props) {
    const {
        seatings,
        orders,
        staff,
        dataTree
    } = useContext(DynamicDataContext);
    
    const {
        setItemInMovement,
        selectedSeating, 
        setSelectedCustomer,
        setSelectedSeating,
    } = useContext(ControlStatesContext);

    const [ seating, setSeating ] = useState(selectedSeating);
    
    useEffect(() => {
        const sectionIndex = dataTree.findIndex(section => section.id === selectedSeating.section_id);

        setSeating(dataTree[sectionIndex].seatings.find(section => section.id === selectedSeating.id));
    }, [ dataTree ]);


    //Mount animations
    const ref = useRef();

    useLayoutEffect(() => {
        const element = ref.current;
        const timeline = gsap.timeline();
        
        timeline.from(element, animations.softElastic);
    
        // Cleanup function to run when component is unmounted
        return () => {
          timeline.kill();
        };

    }, []);

    const [isBlurred, setIsBlurred] = useState(false);
    const [viewTab, setViewTab] = useState(false);
    const [confirmBox, setConfirmBox] = useState(null);

    function openConfirmBox(data) {
        setConfirmBox(data);
        setIsBlurred(true);
    }

    function closeConfirmBox() {
        setConfirmBox(null);
        setIsBlurred(false);
    };

    function handleViewTab(newValue) {
        setViewTab(newValue);
        setIsBlurred(newValue);
    }

    function seatingnumberColor() {
        if (seating.is_available && !seating.is_reserved) return "constructive"
        if (!seating.is_available) return "destructive";
        if (seating.is_reserved) return "progressive";
    }

    function handleClose(){
        gsap.to(ref.current, animations.hardElastic);

        setTimeout(()=> {
            setSelectedCustomer(null);
            setSelectedSeating(null);
        }, 200)
    }

    function handleMoveSeating() {
        setItemInMovement(selectedSeating);
        setSelectedSeating(null);
    }

    const customersInSeating = seating.customers;

    let deliveredOrdersInSeating = [];

    const customerIds = new Set(customersInSeating.map((customer) => customer.id));

    for (const order of orders.get) {
        if (order.is_delivered) {
            if (customerIds.has(order.customer_id)) {
            deliveredOrdersInSeating.push(order);
            }
        }
    }
      
    function resetSeating() {
        openConfirmBox({
            callback: function(){
                seatings.reset(seating);
                closeConfirmBox();
            },
            closeConfirmBox: function(){closeConfirmBox()},
            title: "Are you sure?",
            message: `This will delete all customers and orders in this table, and also set the table as available, not reserved, and no photography booked.`
        })
    }

    let tabTotal = deliveredOrdersInSeating.length > 0 ? 
        deliveredOrdersInSeating.reduce((total, order) => total + order.price, 0) : 0;
    
    return (
        seating.id !== null &&
        <div className="SeatingManager" ref={ref}>
            {confirmBox !== null && <ConfirmBox data={confirmBox}/>}
            {isBlurred && <div className="blur" />}

            <div className="header">
                <div className="assign-waiter">
                    <span className="title cursive">Waiter:</span>
                    {staff.get.length === 0 ? "Loading..." :
                        <select 
                            name="waiters" 
                            id="waiters" 
                            value={seating.waiter} 
                            onChange={(e) => {seatings.setAttribute(seating, 'waiter', e.target.value)}
                        }>
                            <option key={uuid()}></option>
                            {staff.get.map(member => {
                                return (
                                    member.positions.includes("waiter") && 
                                    <option key={uuid()} >
                                        {member.name}
                                    </option>
                                )
                            })}
                        </select>}
                </div>

                <span className={`seatingnumber ${seatingnumberColor()}`}>

                    {seating.number}
                </span>

                <button className="close-button" onClick={handleClose}>
                    <img src={closeIcon} alt="" />
                </button>
            </div>

            <section className="navbar">
                
                <div className="column">
                    <span className="navsection">
                        <span className="title cursive">Vacant:</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                readOnly 
                                checked={seating.is_available}
                                onClick={() => seatings.toggleAttribute(seating, 'is_available')} />
                            <span className="slider" />
                        </label>
                    </span>

                    <span className="navsection">
                        <span className="title cursive">Reserved:</span>
                        <label className="switch">
                            <input 
                            type="checkbox" 
                            readOnly 
                            checked={seating.is_reserved} 
                            onClick={() => seatings.toggleAttribute(seating, 'is_reserved')} />
                            <span className="slider" />
                        </label>
                    </span>

                    <span className="navsection">
                        <span className="title cursive">Photography: </span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                readOnly 
                                checked={seating.is_photography}
                                onClick={() => seatings.toggleAttribute(seating, 'is_photography')} />
                            <span className="slider" />
                        </label>
                    </span>
                </div>

                <div className="column">
                    <span className="view-tab-container">
                        <button className="view-tab-button progressive" onClick={() => handleViewTab(true)}>
                            <span className="column">
                                <img src={basketIcon} alt="" />
                            </span>

                            <span className="column">
                                <span className="items">{deliveredOrdersInSeating.length} items</span>
                                <span className="total">{tabTotal.toLocaleString("en-US")} gil</span>
                            </span>
                        </button>
                    </span>
                </div>
            </section>

            {viewTab && <TabManager 
                deliveredOrdersInSeating={deliveredOrdersInSeating}
                customersInSeating={customersInSeating}
                seating={seating} 
                handleViewTab={handleViewTab}
                tabTotal={tabTotal}
                setConfirmBox={setConfirmBox}
            />}

            <OrderManager 
                seating={seating} 
                customersInSeating={customersInSeating}
                openConfirmBox={openConfirmBox}
                closeConfirmBox={closeConfirmBox}
            />

            
            <section className="navbar-bottom">
                <button onClick={() => {handleMoveSeating()}} className="inactive">
                    Move Table
                </button>
                <button onClick={() => resetSeating()} className="reset-button destructive">
                    <img src={resetIcon} alt="Reset Icon"/> Reset Table
                </button>
            </section>
        </div>
    );
}