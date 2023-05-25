import React from 'react';
import Receipt from './Receipt';
import { useState } from 'react';

export default function ReceiptManager(props) {
    const {  
        setIsBlurred, 
        handleModal, 
        archivedOrdersFromStartDate, 
        archivedSessions, 
        total 
    } = props;

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
                        orders={archivedOrdersFromStartDate.filter(order => (session === order.session && order))}/>
                ))}
            </div>
            <div className="totalEarnings">
                Total: {total.toLocaleString("en-US")} gil
            </div>

        </div>
    );
}