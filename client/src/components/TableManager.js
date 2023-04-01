import React, { useLayoutEffect, useState, useRef }from 'react';
import OrderManager from './OrderManager';
import TabManager from './TabManager';
import ConfirmBox from './ConfirmBox';
import uuid from 'react-uuid';
import { gsap } from 'gsap';
import animations from '../animations.js'

import closeIcon from './../assets/icons/close.png';
import basketIcon from './../assets/icons/shopping-cart.png';
import resetIcon from './../assets/icons/reset-black.png';

export default function TableManager(props) {
    const { 
        table, 
        tables,
        staff,
        orders,
        customers,
        setSelectedCustomer,
        setSelectedTable,
        archivedOrders,
    } = props;

    //Mount animations
    const TableManagerRef = useRef();
    useLayoutEffect(() => {
        gsap.from(TableManagerRef.current, animations.softElastic);

        return () => {
            gsap.to(TableManagerRef.current, animations.softElastic);

        }
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

    function close(){
        setSelectedCustomer(null);
        setSelectedTable(null);
    }



    const customersInTable = customers.get.filter(customer => (
        customer.table === table.id
    ))

    let deliveredOrdersInTable = [];
    let unDeliveredOrdersInTable = [];
    customersInTable.forEach(customer => {
        orders.get.forEach(order => {
            order.delivered ?
                !order.paid &&
                    customer.id === order.customer && 
                        deliveredOrdersInTable.push(order) :
                        unDeliveredOrdersInTable.push(order);
        })
    });

    function resetTable() {
        openConfirmBox({
            callback: function(){
                tables.setIsAvailable(table, true);
                tables.setIsReserved(table, false);
                tables.setIsPhotography(table, false);
        
                customersInTable.forEach(customer => {customers.remove(customer.id, table)});


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
        <div className="TableManager" ref={TableManagerRef}>
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

                    {table.id +1}
                </span>

                <button className="closeButton" onClick={close}>
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
                tables={tables}
                orders={orders}
                archivedOrders={archivedOrders}
                handleViewTab={handleViewTab}
                tabTotal={tabTotal}
                setConfirmBox={setConfirmBox}
            />}

            <OrderManager 
                table={table} 
                tables={tables}
                orders={orders}
                customers={customers}
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