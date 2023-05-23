import React from 'react';
import tools from '.././tools';
import clockIcon from './../assets/icons/clock-black.png';
import ReceiptModal from './ReceiptModal';

export default function Receipt(props) {
    const { orders, setIsBlurred, handleModal } = props;
    const { getFirstName, getLastNames } = tools;

    const { session, time, table } = orders[0];

    const total = orders.reduce((total, customer) => (customer.total + total), 0).toLocaleString("en-US");
    const formattedTime = tools.epochToTime(parseInt(time)).slice(0, -3);
    const link =      
            <div className="link">
                <a href={`https://cocosoasis.info/r.html?id=${session}`}
                target="_blank" rel="noopener noreferrer">{`Receipt Link`}</a>
            </div>;

    let names = orders.map(customer => `${getFirstName(customer.customerName)} ${getLastNames(customer.customerName).join("").charAt(0)}`);
    names = [...new Set(names)];

    return (
        <button className="Receipt" onClick={() => handleModal({title: "Receipt Details", content: <ReceiptModal orders={orders}/>})}>
            <div className="name">
                {names.length > 1 ? names[0] + ` +${names.length-1}` : names[0]}
            </div>

            <div className="data">

                <span className="table">
                    Table {table +1}
                </span>

                <span className="amount">{`${total} gil`}</span>
                
            </div>
        </button>
    );
}



/*
<span className="time">
    <img src={clockIcon}></img>{tools.epochToTime(parseInt(time)).slice(0, -3)}
</span>
*/

