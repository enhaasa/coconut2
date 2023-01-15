import React, { useLayoutEffect, useState, useRef }from 'react';
import { OrderManager } from './OrderManager';
import { TabManager } from './TabManager';
import uuid from 'react-uuid';
import { gsap } from 'gsap';
import animations from '../animations.js'

import closeIcon from './../assets/icons/close.png';
import basketIcon from './../assets/icons/shopping-cart.png';
import { ConfirmBox } from './ConfirmBox';

export function TableManager(props) {

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
        if (props.table.isAvailable && !props.table.isReserved) return "constructive"
        if (!props.table.isAvailable) return "destructive";
        if (props.table.isReserved) return "progressive";
    }

    function close(){
        props.setSelectedCustomer(null);
        props.setSelectedTable(null);
    }

    const customersInTable = props.customers.filter(customer => (
        customer.table === props.table.id
    ))

    let deliveredOrdersInTable = [];
    let unDeliveredOrdersInTable = [];
    customersInTable.forEach(customer => {
        props.orders.forEach(order => {
            order.delivered ?
                !order.paid &&
                    customer.id === order.customer && 
                        deliveredOrdersInTable.push(order) :
                        unDeliveredOrdersInTable.push(order);
        })
    });


    let tabTotal = deliveredOrdersInTable.length > 0 ? 
        deliveredOrdersInTable.reduce((total, order) => total + order.price, 0) : 0;

    
    return (
        props.table.id !== null &&
        <div className="TableManager" ref={TableManagerRef}>
            {confirmBox !== null && <ConfirmBox data={confirmBox}/>}
            {isBlurred && <div className="blur" />}

            <div className="title">
                <div className="assignWaiter">
                    <span className="cursive">Waiter:</span>
                    {props.staff.length === 0 ? "Loading..." :
                        <select 
                            name="waiters" 
                            id="waiters" 
                            value={props.table.waiter} 
                            onChange={(e) => {props.setTableWaiter(props.table, e.target.value)}
                        }>
                            <option key={uuid()}></option>
                            {props.staff.map(staff => {

                                return (
                                    staff.positions.includes("waiter") && 
                                    <option key={uuid()} >
                                        {staff.name}
                                    </option>
                                )
                            })}
                        </select>}
                </div>

                        
                <span className={`tablenumber ${tablenumberColor()}`}>

                    {props.table.id +1}
                </span>

                <button className="closeButton" onClick={close}>
                    <img src={closeIcon} alt="" />
                </button>
            </div>

    
            <section className="navbar">
                <div className="column">
                    <span className="navsection">
                        <span className="cursive">Vacant:</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                readOnly 
                                checked={props.table.isAvailable}
                                onClick={() => props.toggleTableIsAvailable(props.table)} />
                            <span className="slider" />
                        </label>
                    </span>

                    <span className="navsection">
                        <span className="cursive">Reserved:</span>
                        <label className="switch">
                            <input 
                            type="checkbox" 
                            readOnly 
                            checked={props.table.isReserved} 
                            onClick={() => props.toggleTableIsReserved(props.table)} />
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
                table={props.table} 
                orders={props.orders}
                addOrder={props.addOrder}
                removeOrder={props.removeOrder}
                payOrders={props.payOrders}
                archivedOrders={props.archivedOrders}
                handleViewTab={handleViewTab}
                tabTotal={tabTotal}
                setConfirmBox={setConfirmBox}
            />}

            <OrderManager 
                table={props.table} 
                orders={props.orders}
                addOrder={props.addOrder}
                removeOrder={props.removeOrder}
                deliverOrder={props.deliverOrder}
                deliverAll={props.deliverAll}
                customers={props.customers}
                customersInTable={customersInTable}
                unDeliveredOrdersInTable={unDeliveredOrdersInTable}
                addCustomer={props.addCustomer}
                removeCustomer={props.removeCustomer}
                editCustomerName={props.editCustomerName}
                setSelectedCustomer={props.setSelectedCustomer}
                openConfirmBox={openConfirmBox}
                closeConfirmBox={closeConfirmBox}
            />

        </div>
    );
}