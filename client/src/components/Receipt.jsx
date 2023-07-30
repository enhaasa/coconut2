import React, { useContext } from 'react';
import { formatStringAsPrice } from '../tools';
import TableItem from './common/Table/TableItem';
import Button from './common/Button/Button';
import { DynamicDataContext } from '../api/DynamicData';
import ReceiptModal from './ReceiptModal';
import uuid from 'react-uuid';

export default function Receipt(props) {
    const { handleModal, session } = props;
    const { archivedSessions } = useContext(DynamicDataContext);
    const displayName = session.customers.length > 1 ? `${session.customers[0]} & others` : session.customers[0];
 
    return (
        <TableItem
            key={uuid()}
            cols={
                [
                    {
                        type: 'main',
                        content: displayName
                    },
                    {
                        type: 'number',
                        content: formatStringAsPrice(session.amount_paid.toString()) + ' gil'
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
