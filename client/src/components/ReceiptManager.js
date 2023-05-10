import React from 'react';
import Receipt from './Receipt';
import tools from '.././tools';
import { useState } from 'react';

export default function ReceiptManager(props) {
    const { getCurrentDate, sortArchivedArray } = tools;
    const { archivedOrders, setIsBlurred, handleModal } = props;

    const [ selectedFilter, setSelectedFilter ] = useState(0);
    const filters = [
        {
            title: "All",
            keyword: false,
        },
        {
            title: "Tables",
            keyword: 'table'
        },
        {
            title: "Bar",
            keyword: 'bar'
        }
    ];

    const startDateEpoch = getCurrentDate(date => date -1); //Set date filtering offset in days
    const archivedOrdersFromStartDate = sortArchivedArray(archivedOrders.get.map(order => (
        order.date > startDateEpoch && order
    ))).slice(1);

    //const archivedCustomersFromStartDate = archivedOrdersFromStartDate.filter(customer => archivedOrders.get.filter(order => order.customer === customer.name));

    const total = archivedOrdersFromStartDate.reduce((t, c) => t + c.price, 0).toLocaleString("en-US");

    let archivedSessions = archivedOrdersFromStartDate.map(order => order.session);
    archivedSessions = [...new Set(archivedSessions)];
    
    function handleFilter(index) {
        setSelectedFilter(index);
    }

    return (
        <div className="ReceiptManager">
            <nav className="receiptFilter">
                {filters.map((filter, index) => 
                    <button 
                        onClick={() => {handleFilter(index)}}
                        className={index === selectedFilter ? "constructive" : ""}
                    >{filter.title}</button>)}
            </nav>
            <div className="receiptList">
                {archivedSessions.map(session => (
                    <Receipt 
                        key={session}
                        setIsBlurred={setIsBlurred}
                        handleModal={handleModal}
                        orders={archivedOrdersFromStartDate.filter(order => (
                        session === order.session && order       
                    ))}/>
                ))}
            </div>
            <div className="totalEarnings">
                Total: {total} gil
            </div>

        </div>
    );
}