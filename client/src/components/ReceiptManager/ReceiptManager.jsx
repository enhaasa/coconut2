import React from 'react';
import Receipt from '../Receipt/Receipt';
import { useState, useContext } from 'react';
import { DynamicDataContext } from '../../api/DynamicData';
import Table from '../common/Table/Table';
import TableItem from '../common/Table/TableItem';
import Button from '../common/Button/Button';
import uuid from 'react-uuid';

export default function ReceiptManager(props) {
    const {  
        selectedFilter,
        receiptFilters,
        setIsBlurred, 
        handleModal, 
    } = props;

    const {
        archivedSessions
    } = useContext(DynamicDataContext);

    const sessionsByFilter = receiptFilters[selectedFilter].parse(archivedSessions.get);
    const totalByFilteredSessions = sessionsByFilter.reduce((total, current) => total + parseInt(current.amount_paid), 0);
    
    return (
        <div className='ReceiptManager'>
            <div className='row'>
                <div className='list'>
                    <Table>
                        {sessionsByFilter.map(session => (
                            <Receipt 
                                key={uuid()}
                                setIsBlurred={setIsBlurred}
                                handleModal={handleModal}
                                session={session}
                            />
                        ))}
                    </Table>
                </div>
            </div>

            <div className='bottom-list'>
                <div className='total'>
                    Total: {totalByFilteredSessions.toLocaleString('en-US')} gil
                </div>
            </div>

        </div>
    );
}