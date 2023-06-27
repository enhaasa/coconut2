import React from 'react';
import Receipt from './Receipt';
import { useState, useEffect } from 'react';

export default function ReceiptManager(props) {
    const {  
        setIsBlurred, 
        handleModal, 
        archivedOrders,
        archivedSessions, 
        total ,
        floors
    } = props;

    const sessions = archivedSessions.get.map(session => {
        const ordersInSession = archivedOrders.get.filter(order => session.id === order.session && order);

        return {
            ...session,
            orders: ordersInSession
        }
    });

    const [ selectedFilter, setSelectedFilter ] = useState(0);
    const filters = [
        {
            title: "All",
            keyword: false,
        },
        {
            title: "Restaurant",
            keyword: 'restaurant'
        },
        {
            title: "Bar",
            keyword: 'bar'
        }
    ];
    const sessionsByFilter = sessions.filter(session => (
        !filters[selectedFilter] ||
        (
            !filters[selectedFilter].keyword ||
            getFloorNameByFloorType(session.floor) === filters[selectedFilter].keyword
        ) && session
    ));
    const totalByFilteredSessions = sessionsByFilter.reduce((total, current) => total + parseInt(current.paidAmount), 0);

    function getFloorNameByFloorType(type) {
        return floors.find(f => f.name === type).type
    }
    
    function handleFilter(index) {
        setSelectedFilter(index);
    }

   

    return (
        <div className="ReceiptManager">
            <div className="row">
                {
                <nav className="receiptFilter">
                    {filters.map((filter, index) => 
                        <button 
                            onClick={() => {handleFilter(index)}}
                            className={index === selectedFilter ? "steel" : "inactive"}
                        >{filter.title}</button>)}
                </nav>
                }
                <div className="receiptList">
                    {sessionsByFilter.map(session => (
                        <Receipt 
                        key={session.id}
                        setIsBlurred={setIsBlurred}
                        handleModal={handleModal}
                        session={session}
                        archivedSessions={archivedSessions}
                        />
                    ))}
                </div>
            </div>

            <div className="row">
                <div className="totalEarnings">
                    Total: {totalByFilteredSessions.toLocaleString("en-US")} gil
                </div>
            </div>

        </div>
    );
}