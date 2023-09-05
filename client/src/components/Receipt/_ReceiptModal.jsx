import React, { useState, useContext } from 'react';

//Components
import Table from '../common/Table/Table';
import TableItem from '../common/Table/TableItem';
import Button from '../common/Button/Button';

//Tools
import uuid from 'react-uuid';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

export default function ReceiptModal(props) {
    const { session, archivedSessions, handleModal } = props;

    const {
        orders
    } = useContext(DynamicDataContext);

    const total = session.price;
    const [ amountPaid, setAmountPaid ] = useState(session.amount_paid);
    const tips = amountPaid - total < 0 ? 0 : amountPaid - total;
    

    function handleAmountPaid(amount) {
        setAmountPaid(amount);
    }

    return(
        <div className='ReceiptModal'>
            <Table>
                {orders.utils.sortArray(session.orders).map(order => (
                    <TableItem 
                        key={uuid()}
                        cols={
                            [
                                {
                                    type: 'text',
                                    content: order.name
                                }, {
                                    type: 'number',
                                    content: order.price.toLocaleString('en-US') + ' gil'
                                },{
                                    type: 'text',
                                    content: `x${order.amount}`
                                }, {
                                    type: 'number',
                                    content: order.total.toLocaleString('en-US') + ' gil'
                                }
                            ]
                        }
                    />
                ))}
            </Table>

            <div className='receipt-summary'>
                <div className='row'>
                    <span>Tips:</span>
                    <span>{tips.toLocaleString('en-US') + ' gil'}</span>
                </div>

                <div className='row'>
                    <span>Total:</span>
                    <span>{session.amount_paid.toLocaleString('en-us') + ' gil'}</span>        
                </div>
            </div>

            
            <div className='paid-amount'>
                <label>Amount paid:</label> 
                <input type='number' 
                    value={amountPaid} 
                    onChange={(e) => handleAmountPaid(e.target.value)}>
                </input>
                <Button 
                    type='constructive' 
                    pendingResponseClickEvent={{
                        args: [session, parseInt(amountPaid)],
                        event: archivedSessions.setAmountPaid
                    }}
                    postEventCallback={() => handleModal(null)}
                    disabled={amountPaid === total ? true : false}>
                    Save
                </Button>
            </div>
            <br />
            

            <div className='receipt-RP'>
                <a href={`https://cocosoasis.info/r.html?id=${session.id}`}
                target='_blank' rel='noopener noreferrer'>{`Receipt Link`}</a>

                <textarea 
                    value={`/em hands over the tab: cocosoasis.info/r.html?id=${session.id} ((${total.toLocaleString('en-US')} gil))`} 
                    readOnly
                    contentEditable={false}
                    spellCheck={false}
                />
            </div>
            
        </div>
    );
}