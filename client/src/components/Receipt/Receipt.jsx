import React, { useContext } from 'react';

//Components
import TableItem from '../common/Table/TableItem';
import Button from '../common/Button/Button';
import ReceiptModal from './_ReceiptModal';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Tools
import { formatStringAsPrice } from '../../utils/currency';
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
