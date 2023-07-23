import React from 'react';
import Receipt from './Receipt';
import { useState, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import Table from './common/Table/Table';
import TableItem from './common/Table/TableItem';
import Button from './common/Button/Button';
import uuid from 'react-uuid';

export default function ReceiptManager(props) {
    const {  
        setIsBlurred, 
        handleModal, 
    } = props;

    const {
        archivedSessions, sections
    } = useContext(DynamicDataContext);

    const [ selectedFilter, setSelectedFilter ] = useState(0);
    const filters = [
        {
            title: "Mine",
            parse: arr => arr
        },
        {
            title: "All",
            parse: arr => arr
        },
        ...sections.get.map(section => ({
            title: section.name,
            parse: arr => arr.filter(i => i.channel.section_name === section.name)
        }))
    ];

    const sessionsByFilter = filters[selectedFilter].parse(archivedSessions.get);
    const totalByFilteredSessions = sessionsByFilter.reduce((total, current) => total + parseInt(current.amount_paid), 0);
    
    function handleFilter(index) {
        setSelectedFilter(index);
    }

    return (
        <div className="ReceiptManager">
            <div className="row">
                {
                <nav className="filter">
                    {filters.map((filter, index) => 
                        <button 
                            key={uuid()}
                            onClick={() => {handleFilter(index)}}
                            className={index === selectedFilter ? "steel" : "inactive"}
                        >{filter.title}</button>)}
                </nav>
                    }
                <div className="list">
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

            <div className="bottom-list">
                <div className="total">
                    Total: {totalByFilteredSessions.toLocaleString("en-US")} gil
                </div>
            </div>

        </div>
    );
}