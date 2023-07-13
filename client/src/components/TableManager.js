import React, { useLayoutEffect, useState, useRef, useContext }from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import OrderManager from './OrderManager';
import TabManager from './TabManager';
import ConfirmBox from './ConfirmBox';
import uuid from 'react-uuid';
import { gsap } from 'gsap';
import animations from '../animations.js'
import db from '../dbTools_client';

import closeIcon from './../assets/icons/close.png';
import basketIcon from './../assets/icons/shopping-cart.png';
import resetIcon from './../assets/icons/reset-black.png';

export default function TableManager(props) {
    const { 
        table, 
        setSelectedCustomer,
        setSelectedTable,
    } = props;

    const {
        tables,
        orders,
        staff,
        customers,
    } = useContext(DynamicDataContext);

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

    function tablenumberColor() {
        if (table.isAvailable && !table.isReserved) return "constructive"
        if (!table.isAvailable) return "destructive";
        if (table.isReserved) return "progressive";
    }

    function handleClose(){
        gsap.to(ref.current, animations.hardElastic);

        setTimeout(()=> {
            setSelectedCustomer(null);
            setSelectedTable(null);
        }, 200)
    }

    const customersInTable = customers.get.filter(customer => (
        customer.table_id === table.id
    ))

    



    let deliveredOrdersInTable = [];
    let unDeliveredOrdersInTable = [];

    const customerIds = new Set(customersInTable.map((customer) => customer.id));

    for (const order of orders.get) {
        if (order.is_delivered) {
            if (!order.is_paid && customerIds.has(order.customer_id)) {
            deliveredOrdersInTable.push(order);
            }
        } else {
            unDeliveredOrdersInTable.push(order);
        }
    }

    function combineCustomersWithOrders(customers, orders) {
        const customerMap = new Map();
        
        // Create a map of customers using their IDs as keys
        for (const customer of customers.get) {
          customerMap.set(customer.id, {
            ...customer,
            orders: [] // Initialize an empty orders array
          });
        }
      
        // Add orders to the corresponding customers
        for (const order of orders.get) {
          const customerId = order.customer_id;
          if (customerMap.has(customerId)) {
            customerMap.get(customerId).orders.push(order);
          }
        }
      
        // Return the combined array of customers with orders
        return Array.from(customerMap.values());
    }
      
    const customerMap = combineCustomersWithOrders(customers, orders);


    function resetTable() {
        openConfirmBox({
            callback: function(){
                tables.setIsAvailable(table, true);
                tables.setIsReserved(table, false);
                tables.setIsPhotography(table, false);
                tables.set(prev => {
                    prev[table.id].session = null;
                    return [...prev];
                });

                customers.removeAllFromTable(table.id)
                closeConfirmBox();
            },
            closeConfirmBox: function(){closeConfirmBox()},
            title: "Are you sure?",
            message: `This will delete all customers and orders in this table, and also set the table as available, not reserved, and no photography booked.`
        })
    }

    let tabTotal = deliveredOrdersInTable.length > 0 ? 
        deliveredOrdersInTable.reduce((total, order) => total + order.price, 0) : 0;
    
    return (
        table.id !== null &&
        <div className="TableManager" ref={ref}>
            {confirmBox !== null && <ConfirmBox data={confirmBox}/>}
            {isBlurred && <div className="blur" />}

            <div className="header">
                <div className="assignWaiter">
                    <span className="title cursive">Waiter:</span>
                    {staff.get.length === 0 ? "Loading..." :
                        <select 
                            name="waiters" 
                            id="waiters" 
                            value={table.waiter} 
                            onChange={(e) => {tables.setWaiter(table, e.target.value)}
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

                        
                <span className={`tablenumber ${tablenumberColor()}`}>

                    {table.number}
                </span>

                <button className="closeButton" onClick={handleClose}>
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
                                checked={table.isAvailable}
                                onClick={() => tables.toggleIsAvailable(table)} />
                            <span className="slider" />
                        </label>
                    </span>

                    <span className="navsection">
                        <span className="title cursive">Reserved:</span>
                        <label className="switch">
                            <input 
                            type="checkbox" 
                            readOnly 
                            checked={table.isReserved} 
                            onClick={() => tables.toggleIsReserved(table)} />
                            <span className="slider" />
                        </label>
                    </span>

                    <span className="navsection">
                        <span className="title cursive">Photography: </span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                readOnly 
                                checked={table.isPhotography}
                                onClick={() => tables.toggleIsPhotography(table)} />
                            <span className="slider" />
                        </label>
                    </span>
                </div>

                <div className="column">
                    <span className="viewTabContainer">
                        <button className="viewTabButton progressive" onClick={() => handleViewTab(true)}>
                            <span className="column">
                                <img src={basketIcon} alt="" />
                            </span>

                            <span className="column">
                                <span className="items">{deliveredOrdersInTable.length} items</span>
                                <span className="total">{tabTotal.toLocaleString("en-US")} gil</span>
                            </span>
                        </button>
                    </span>
                </div>
            </section>

            {viewTab && <TabManager 
                deliveredOrdersInTable={deliveredOrdersInTable}
                customersInTable={customersInTable}
                table={table} 
                handleViewTab={handleViewTab}
                tabTotal={tabTotal}
                setConfirmBox={setConfirmBox}
            />}

            <OrderManager 
                table={table} 
                customersInTable={customersInTable}
                unDeliveredOrdersInTable={unDeliveredOrdersInTable}
                setSelectedCustomer={setSelectedCustomer}
                openConfirmBox={openConfirmBox}
                closeConfirmBox={closeConfirmBox}
            />

            <button onClick={() => resetTable()} className="resetButton destructive">
                <img src={resetIcon} /> Reset Table
            </button>

        </div>
    );
}