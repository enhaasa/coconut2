import React, { useLayoutEffect, useState, useRef, useContext, useEffect }from 'react';

//Contexts
import { DynamicDataContext } from '../api/DynamicData';
import { ControlStatesContext } from '../api/ControlStates';

//Components
import OrderManager from './OrderManager';
import TabManager from './TabManager';
import ConfirmBox from './ConfirmBox';
import Dropdown from './common/Dropdown/Dropdown';
import DropdownItem from './common/Dropdown/DropdownItem';
import Button from './common/Button/Button';
import CloseButton from './common/CloseButton/CloseButton';

//Animations
import { gsap } from 'gsap';
import animations from '../animations.js'

//Icons
import resetIcon from './../assets/icons/reset-small-white.png';
import receiptIcon from './../assets/icons/receipt2-small-black.png';

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

                    {
                        <Dropdown 
                            defaultValue={seating.waiter}
                            onChangeEvent={({target}) => {seatings.setAttribute(seating, 'waiter', target.value)}}>
                            {staff.get.map(member => (
                                member.positions.includes("waiter") &&
                                <DropdownItem>{member.name}</DropdownItem>
                            ))}
                            
                        </Dropdown>
                    }
                </div>

                <span className={`seatingnumber ${seatingnumberColor()}`}>

                    {seating.number}
                </span>
                
                <span className="close-button">
                    <CloseButton clickEvent={handleClose}/>
                </span>
            </div>

            <section className="navbar">
                
                <div className="column">
                    <span className="navsection">
                        <span className="title cursive">Available:</span>
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
                        <div className="tab-summary">
                            <div className="row">
                                {deliveredOrdersInSeating.length} items 
                            </div>
                            <div className="row">
                                {tabTotal.toLocaleString("en-US")} gil
                            </div>
                        </div>

                        <Button type="progressive" clickEvent={() => handleViewTab(true)}>
                            <img src={receiptIcon} alt="Receipt Icon" />
                            View Tab
                        </Button>
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

            <section className="OrderManagerContainer">
                <OrderManager 
                    seating={seating} 
                    customersInSeating={customersInSeating}
                    openConfirmBox={openConfirmBox}
                    closeConfirmBox={closeConfirmBox}
                />
            </section>

            <section className="navbar-bottom">
                <Button type="dark" clickEvent={handleMoveSeating}>
                    Move Table
                </Button>

                <Button type="destructive" clickEvent={resetSeating}>
                    <img src={resetIcon} alt="Reset Icon"/> Reset Table
                </Button>
            </section>
        </div>
    );
}