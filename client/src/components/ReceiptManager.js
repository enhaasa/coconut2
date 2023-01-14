import React from 'react';
import { Receipt } from './Receipt';

export function ReceiptManager(props) {

    return (
        <div className="ReceiptManager">

            <div className="receiptList">
                <Receipt 
                    archivedOrders={props.archivedOrders}
                />
            </div>
        </div>
    );
}