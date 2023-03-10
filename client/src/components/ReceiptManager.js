import React from 'react';
import Receipt from './Receipt';
import tools from '.././tools';

export default function ReceiptManager(props) {
    const { getDate, dateToEpoch, sortArchivedArray } = tools;
    const { archivedOrders } = props;

    const startDateEpoch = dateToEpoch(getDate((date) => date -1)); //Set date filtering offset in days

    const archivedCustomersFromStartDate = sortArchivedArray(archivedOrders.get.map(order => (
        order.time > startDateEpoch && order
    ))).slice(1);

    let archivedSessions = archivedCustomersFromStartDate.map(order => order.session);
    archivedSessions = [...new Set(archivedSessions)];

    return (
        <div className="ReceiptManager">

            <div className="title"><u>Today & yesterday's receipts:</u></div>
            <div className="receiptList">
                {archivedSessions.map(session => (
                    <Receipt 
                        key={session}
                        customers={archivedCustomersFromStartDate.filter(customer => (
                        session === customer.session && customer       
                    ))}/>
                ))}
            </div>

        </div>
    );
}