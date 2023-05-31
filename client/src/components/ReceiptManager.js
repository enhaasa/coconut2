import React from 'react';
import Receipt from './Receipt';
import { useState } from 'react';

export default function ReceiptManager(props) {
    const {  
        setIsBlurred, 
        handleModal, 
        archivedOrders,
        archivedSessions, 
        total 
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
            <div className="row">
                {/*
                <nav className="receiptFilter">
                    {filters.map((filter, index) => 
                        <button 
                            onClick={() => {handleFilter(index)}}
                            className={index === selectedFilter ? "steel" : "inactive"}
                        >{filter.title}</button>)}
                </nav>
                */}
                <div className="receiptList">
                    {sessions.map(session => (
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
                    Total: {total.toLocaleString("en-US")} gil
                </div>
            </div>

        </div>
    );
}