import React from 'react';
import Receipt from './Receipt';
import { useState, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';

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

    /*
    const sessionsByFilter = sessions.filter(session => (
        !filters[selectedFilter] ||
        (
            !filters[selectedFilter].keyword ||
            getFloorNameByFloorType(session.floor) === filters[selectedFilter].keyword
        ) && session
    ));
        

    const totalByFilteredSessions = sessionsByFilter.reduce((total, current) => total + parseInt(current.amount_paid), 0);
            
    function getFloorNameByFloorType(type) {
        return floors.find(f => f.name === type).type
    }
    */
    
    function handleFilter(index) {
        setSelectedFilter(index);
    }

    return (
        <div className="ReceiptManager">
            <div className="row">
                {
                <nav className="receiptFilter">
                    {filters.map((filter, index) => 
                        <button 
                            onClick={() => {handleFilter(index)}}
                            className={index === selectedFilter ? "steel" : "inactive"}
                        >{filter.title}</button>)}
                </nav>
                    }
                <div className="receiptList">
                    {sessionsByFilter.map(session => (
                        <Receipt 
                            key={session.id}
                            setIsBlurred={setIsBlurred}
                            handleModal={handleModal}
                            session={session}
                        />
                    ))}
                </div>
            </div>

            <div className="row">
                <div className="totalEarnings">
                    Total: {totalByFilteredSessions.toLocaleString("en-US")} gil
                </div>
            </div>

        </div>
    );
}