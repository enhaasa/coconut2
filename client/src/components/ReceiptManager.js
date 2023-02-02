import React from 'react';
import { Receipt } from './Receipt';
import tools from '.././tools';

export function ReceiptManager(props) {
    const { getDate, dateToEpoch, sortArchivedArray } = tools;
    const { archivedOrders } = props;

    const startDateEpoch = dateToEpoch(getDate((date) => date -1)); //Set date filtering offset in days

    const archivedCustomersFromStartDate = sortArchivedArray(archivedOrders.map(order => (
        order.time > startDateEpoch && order
    ))).slice(1);

    let archivedSessions = archivedCustomersFromStartDate.map(order => order.session);
    archivedSessions = [...new Set(archivedSessions)];

    return (
        <div className="ReceiptManager">

            <div className="title">Today's Sales~~</div>
            <div className="receiptList">
                {archivedSessions.map(session => (
                    <Receipt customers={archivedCustomersFromStartDate.filter(customer => (
                        session === customer.session && customer       
                    ))}/>
                ))}
            </div>

        </div>
    );
}