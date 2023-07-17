import React, { useEffect, useContext } from 'react';
import tools from '.././tools';
import clockIcon from './../assets/icons/clock-black.png';
import { DynamicDataContext } from '../api/DynamicData';
import ReceiptModal from './ReceiptModal';

export default function Receipt(props) {
    const { handleModal, sessionID, session } = props;

    const { archivedSessions } = useContext(DynamicDataContext);




    //const total = session.orders.reduce((total, order) => (order.price + total), 0).toLocaleString("en-US");
    //const formattedTime = tools.epochToTime(parseInt(time)).slice(0, -3);

    const link =      
            <div className="link">
                <a href={`https://cocosoasis.info/r.html?id=${session}`}
                target="_blank" rel="noopener noreferrer">{`Receipt Link`}</a>
            </div>;

    const displayName = session.customers.length > 1 ? `${session.customers[0]} & others` : session.customers[0];
 
    return (
        <button 
            className="Receipt progressive" 
            onClick={() => handleModal(
                    {
                        title: displayName, 
                        content: <ReceiptModal 
                            session={session} 
                            handleModal={handleModal}
                            archivedSessions={archivedSessions}/>
                    }
                )}
        >
            <div className="name">
                {displayName}
            </div>

            <div className="data">

                <span className="table">
                {session.channel.name}
                </span>

                <span className="amount">{session.amount_paid.toLocaleString('en-us') + " gil"}</span>
                
            </div>
        </button>
    );
}

/*
<span className="time">
    <img src={clockIcon}></img>{tools.epochToTime(parseInt(time)).slice(0, -3)}
</span>
*/

