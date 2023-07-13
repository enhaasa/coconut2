import React from 'react';
import tools from '.././tools';
import clockIcon from './../assets/icons/clock-black.png';
import ReceiptModal from './ReceiptModal';

export default function Receipt(props) {
    const { orders, handleModal, session, archivedSessions } = props;
    const { getFirstName, getLastNames } = tools;

    const { time, table } = session;

    const total = session.orders.reduce((total, order) => (order.price + total), 0).toLocaleString("en-US");

    const formattedTime = tools.epochToTime(parseInt(time)).slice(0, -3);

    const link =      
            <div className="link">
                <a href={`https://cocosoasis.info/r.html?id=${session}`}
                target="_blank" rel="noopener noreferrer">{`Receipt Link`}</a>
            </div>;

    let names = session.orders.map(customer => `${getFirstName(customer.customerName)} ${getLastNames(customer.customerName).join("").charAt(0)}`);
    names = [...new Set(names)];

    const parsedTable = table ? `Table ${table +1}` : "Bar";

 
    return (
        <button 
            className="Receipt progressive" 
            onClick={() => handleModal(
                    {
                        title: "Receipt Details", 
                        content: <ReceiptModal 
                            session={session} 
                            handleModal={handleModal}
                            archivedSessions={archivedSessions}/>
                    }
                )}
        >
            <div className="name">
                {names.length > 1 ? names[0] + ` +${names.length-1}` : names[0]}
            </div>

            <div className="data">

                <span className="table">
                {parsedTable}
                </span>

                <span className="amount">{`${session.paidAmount.toLocaleString("en-US")} gil`}</span>
                
            </div>
        </button>
    );
}



/*
<span className="time">
    <img src={clockIcon}></img>{tools.epochToTime(parseInt(time)).slice(0, -3)}
</span>
*/

