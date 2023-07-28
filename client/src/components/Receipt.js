import React, { useEffect, useContext } from 'react';
import { formatStringAsPrice } from '.././tools';
import clockIcon from './../assets/icons/clock-black.png';
import TableItem from './common/Table/TableItem';
import Button from './common/Button/Button';
import { DynamicDataContext } from '../api/DynamicData';
import ReceiptModal from './ReceiptModal';
import uuid from 'react-uuid';

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

        <TableItem
            key={uuid()}
            cols={
                [
                    {
                        type: 'text',
                        content: displayName
                    },
                    {
                        type: 'number',
                        content: formatStringAsPrice(session.amount_paid.toString()) + " gil"
                    },
                    {
                        type: 'nav',
                        content: 
                        <>
                            <Button type='neutral' clickEvent={() => handleModal({
                                title: displayName, 
                                content: <ReceiptModal 
                                    session={session} 
                                    handleModal={handleModal}
                                    archivedSessions={archivedSessions}/>
                            })}>
                            Edit
                            </Button>
                        </>
                    }
                ]
            }
        />
    );
}

/*
<span className="time">
    <img src={clockIcon}></img>{tools.epochToTime(parseInt(time)).slice(0, -3)}
</span>
*/

