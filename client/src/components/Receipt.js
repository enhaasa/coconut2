import React from 'react';

export function Receipt(props) {

    return (
        <div className="Receipt">
            
            

            {props.archivedOrders.map(archivedOrder => archivedOrder.customerName)}
        </div>
    );
}