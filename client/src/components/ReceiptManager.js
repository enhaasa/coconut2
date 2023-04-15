import React from 'react';
import Receipt from './Receipt';
import tools from '.././tools';

export default function ReceiptManager(props) {
    const { getCurrentDate, sortArchivedArray } = tools;
    const { archivedOrders } = props;

    const startDateEpoch = getCurrentDate(date => date -1); //Set date filtering offset in days

    const archivedCustomersFromStartDate = sortArchivedArray(archivedOrders.get.map(order => (
        order.date > startDateEpoch && order
    ))).slice(1);

    const archivedOrdersFromStartDate = archivedCustomersFromStartDate.filter(customer => archivedOrders.get.filter(order => order.customer === customer.name));

    const total = archivedOrdersFromStartDate.reduce((t, c) => t + c.price, 0).toLocaleString("en-US");


    let archivedSessions = archivedCustomersFromStartDate.map(order => order.session);

    archivedSessions = [...new Set(archivedSessions)];
    

    return (
        <div className="ReceiptManager">

            <div className="header">
                <div className="title cursive">
                    Receipts
                </div>

                <div className="underTitle">
                    Today and yesterday
                </div>
            </div>
            <div className="receiptList">
                {archivedSessions.map(session => (
                    <Receipt 
                        key={session}
                        customers={archivedCustomersFromStartDate.filter(customer => (
                        session === customer.session && customer       
                    ))}/>
                ))}
            </div>
            <div className="totalEarnings">
                Total: {total} gil
            </div>

        </div>
    );
}