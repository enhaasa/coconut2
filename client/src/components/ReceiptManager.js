import React from 'react';

export function ReceiptManager(props) {

    return (
        <div className="ReceiptManager">
            {props.archivedOrders.map(archivedOrder => archivedOrder.customerName)}
        </div>
    );
}