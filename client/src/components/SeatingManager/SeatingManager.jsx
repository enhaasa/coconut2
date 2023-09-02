import React, { useLayoutEffect, useState, useRef, useContext, useEffect }from 'react';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';

//Tools
import uuid from 'react-uuid';
import { formatStringAsPrice } from '../../utils';

//Components
import OrderManager from '../OrderManager/OrderManager';
import TabManager from '../TabManager/TabManager';
import ConfirmBox from '../common/ConfirmBox/ConfirmBox';
import Dropdown from '../common/Dropdown/Dropdown';
import DropdownItem from '../common/Dropdown/DropdownItem';
import Button from '../common/Button/Button';
import CloseButton from '../common/CloseButton/CloseButton';
import Toggle from '../common/Toggle/Toggle';
import MenuInfoModal from '../MenuManager/_MenuInfoModal';
import DeleteButton from '../common/Button/_DeleteButton';

//Animations
import { gsap } from 'gsap';
import animations from '../../animations.js'

//Icons
import resetIcon from './../../assets/icons/reset-small-white.png';
import receiptIcon from './../../assets/icons/receipt2-small-white.png';

export default function SeatingManager() {
    const {
        seatings,
        orders,
        staff,
        dataTree,
    } = useContext(DynamicDataContext);
    
    const {
        setItemInMovement,
        selectedSeating, 
        setSelectedCustomer,
        setSelectedSeating,
        isDangerousSettings,
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
    const [itemInfo, setItemInfo] = useState(null);

    function handleItemInfo(item) {
        setItemInfo(item);
        item !== null ? 
            setIsBlurred(true) :
            setIsBlurred(false);
    }

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
        if (seating.is_available && !seating.is_reserved) return 'constructive'
        if (!seating.is_available) return 'destructive';
        if (seating.is_reserved) return 'progressive';
    }

    function handleClose(){
        gsap.to(ref.current, animations.fadeFall);

        setTimeout(()=> {
            setSelectedCustomer(null);
            setSelectedSeating(null);
        }, 100)
    }

    function handleMoveSeating() {
        setItemInMovement({
            type: 'seating', 
            item: seating,
            moveFunction: seatings.setLocation
        });
        setSelectedSeating(null);
    }

    function handleRemove() {
        openConfirmBox({
            pendingRequestEvent: {
                args: [selectedSeating],
                event: seatings.remove
            },
            closeConfirmBox: function(){closeConfirmBox()},
            title: 'Danger danger danger!',
            message: `This will remove all customers, cancel all orders, and PERMANENTLY DESTROY the table (no undo).`
        })
    }

    const customersInSeating = seating ? seating.customers : [];
    let deliveredOrdersInSeating = [];

    const customerIds = new Set(customersInSeating.map((customer) => customer.id));
    for (const order of orders.get) {
        if (order.is_delivered) {
            if (customerIds.has(order.customer_id)) {
                deliveredOrdersInSeating.push(order);
            }
        }
    }

    const completedServices = customersInSeating.flatMap(c => c.completedServices);
    const ordersTotal = deliveredOrdersInSeating.reduce((total, order) => (total + order.price), 0);
    const servicesTotal = completedServices.reduce((total, service) => (total + service.price), 0);
      
    function handleResetSeating() {
        openConfirmBox({
            pendingRequestEvent: {
                args: [seating],
                event: seatings.reset
            },
            closeConfirmBox: function(){closeConfirmBox()},
            title: 'Are you sure?',
            message: `This will delete all customers and orders in this table, and also set the table as available, not reserved, and no photography booked.`
        })
    }

    let tabTotal = deliveredOrdersInSeating.length > 0 
        ? deliveredOrdersInSeating.reduce((total, order) => total + order.price, 0) 
        : 0;
    
    return (
        seating && seating.id !== null &&
        <>
            <div className='SeatingManager' ref={ref}>
                {confirmBox !== null && <ConfirmBox data={confirmBox}/>}
                {isBlurred && <div className='blur' />}
                {itemInfo && <MenuInfoModal item={itemInfo} handleItemInfo={handleItemInfo}/>}
                
                <div className='header'>
                    <div className='assign-waiter'>
                        <span className='title cursive'>Waiter:</span>

                        {
                            <Dropdown 
                                value={seating.waiter}
                                onChangeEvent={({target}) => {seatings.setAttribute(seating, 'waiter', target.value)}}>
                                    <DropdownItem key={uuid()}></DropdownItem>
                                {staff.get.map(member => (
                                    member.positions.includes('waiter') &&
                                    <DropdownItem key={uuid()}>{member.name}</DropdownItem>
                                ))}
                                
                            </Dropdown>
                        }
                    </div>

                    <span className={`seatingnumber ${seatingnumberColor()}`}>
                        {seating.number}
                    </span>
                    
                    <span className='close-button'>
                        <CloseButton clickEvent={handleClose}/>
                    </span>
                </div>

                <section className='navbar'>
                    
                    <div className='column'>
                        <span className='navsection'>
                            <span className='title cursive'>Available:</span>
                            <Toggle 
                                value={seating.is_available}
                                clickEvent={() => seatings.toggleAttribute(seating, 'is_available')}
                            />
                        </span>

                        <span className='navsection'>
                            <span className='title cursive'>Reserved:</span>
                            <Toggle 
                                value={seating.is_reserved}
                                clickEvent={() => seatings.toggleAttribute(seating, 'is_reserved')}
                            />
                        </span>
                    </div>

                    <div className='column'>
                        <span className='view-tab-container'>
                            <div className='tab-summary'>
                                <div className='row'>
                                    {`${formatStringAsPrice(`${ordersTotal + servicesTotal}`)} gil`}
                                </div>
                                <div className='row'>
                                    {deliveredOrdersInSeating.length > 0 && `${deliveredOrdersInSeating.length} order(s) `}
                                    {completedServices.length > 0 && `${completedServices.length} service(s) `}
                                </div>
                            </div>

                            <Button type='dark' clickEvent={() => handleViewTab(true)}>
                                <img src={receiptIcon} alt='Receipt Icon' />
                                View Tab
                            </Button>
                        </span>
                    </div>
                </section>

                {viewTab && <TabManager 
                    deliveredOrdersInSeating={deliveredOrdersInSeating}
                    customersInSeating={customersInSeating}
                    seating={seating} 
                    completedServices={completedServices}
                    ordersTotal={ordersTotal}
                    servicesTotal={servicesTotal}
                    handleViewTab={handleViewTab}
                    tabTotal={tabTotal}
                    setConfirmBox={setConfirmBox}
                />}

                <section className='OrderManagerContainer'>
                    <OrderManager 
                        handleItemInfo={handleItemInfo}
                        seating={seating} 
                        customersInSeating={customersInSeating}
                        openConfirmBox={openConfirmBox}
                        closeConfirmBox={closeConfirmBox}
                    />
                </section>

                <section className='navbar-bottom'>
                    <span className='column last'>
                        <Button type='destructive' clickEvent={handleResetSeating}>
                            Reset Table
                        </Button>
                    </span>

                    {isDangerousSettings &&
                        <span className='column'>
                            <DeleteButton type='destructive' clickEvent={handleRemove} />

                            <Button type='dark' clickEvent={handleMoveSeating}>
                                Move
                            </Button>
                        </span>
                    }
                </section>
            </div>
        </>
    );
}