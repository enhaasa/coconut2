import React, { useLayoutEffect, useState, useRef, useContext, useEffect }from 'react';
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
        selectedTable, 
        setSelectedCustomer,
        setSelectedTable,
    } = props;

    const {
        tables,
        orders,
        staff,
        customers,
        dataTree
    } = useContext(DynamicDataContext);

    const [ table, setTable ] = useState(selectedTable);
    
    useEffect(() => {
        const sectionIndex = dataTree.findIndex(section => section.id === selectedTable.section_id);

        setTable(dataTree[sectionIndex].tables.find(section => section.id === selectedTable.id));
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

    function tablenumberColor() {
        if (table.is_available && !table.is_reserved) return "constructive"
        if (!table.is_available) return "destructive";
        if (table.is_reserved) return "progressive";
    }

    function handleClose(){
        gsap.to(ref.current, animations.hardElastic);

        setTimeout(()=> {
            setSelectedCustomer(null);
            setSelectedTable(null);
        }, 200)
    }

    const customersInTable = table.customers;

    let deliveredOrdersInTable = [];

    const customerIds = new Set(customersInTable.map((customer) => customer.id));

    for (const order of orders.get) {
        if (order.is_delivered) {
            if (customerIds.has(order.customer_id)) {
            deliveredOrdersInTable.push(order);
            }
        }
    }

    
    
      
    function resetTable() {
        openConfirmBox({
            callback: function(){
                tables.reset(table);
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
                            onChange={(e) => {tables.setAttribute(table, 'waiter', e.target.value)}
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
                                checked={table.is_available}
                                onClick={() => tables.toggleAttribute(table, 'is_available')} />
                            <span className="slider" />
                        </label>
                    </span>

                    <span className="navsection">
                        <span className="title cursive">Reserved:</span>
                        <label className="switch">
                            <input 
                            type="checkbox" 
                            readOnly 
                            checked={table.is_reserved} 
                            onClick={() => tables.toggleAttribute(table, 'is_reserved')} />
                            <span className="slider" />
                        </label>
                    </span>

                    <span className="navsection">
                        <span className="title cursive">Photography: </span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                readOnly 
                                checked={table.is_photography}
                                onClick={() => tables.toggleAttribute(table, 'is_photography')} />
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