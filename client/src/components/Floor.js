import React, { useLayoutEffect, useRef, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import Table from './Table';
import BarManager from './BarManager';
import gsap from 'gsap';
import animations from '../animations';

import overlay from './../assets/icons/dark-fabric.png';

export default function Floor(props) {
    const {
        section,
        maxDeliveryTime, 
        colorset,
        setSelectedTable,
        setSelectedCustomer,
        setSelectedCustomerManager,
        floor
    } = props;

    const {
        customers,
        orders,
        tables,
    } = useContext(DynamicDataContext);

    const FloorRef = useRef();

    let tablesInSection = [];

    tables.get.forEach((table, index) => {
        if (table.section_name === section.name)
            tablesInSection.push({
                ...table, index: index
            })
    });

    /*  
        <BarManager 
            orders={orders}
            section={section}
            customers={customers} 
            setSelectedCustomer={setSelectedCustomer} 
            setSelectedCustomerManager={setSelectedCustomerManager}
        />

    */

    return (

       
            <div className="Floor" ref={FloorRef}>
           
                <img className="overlay" src={overlay} alt="" />
                {floor.image_url && <img className="floorImage" src={floor.image_url} alt="" />}

                {floor.tables.map((table) => (
                        <Table 
                            table={table}
                            maxDeliveryTime={maxDeliveryTime}
                            colorset={colorset} 
                            setSelectedTable={setSelectedTable}
                            key={table.id}
                        />
                    )) 
                }
            
            </div>
        
    );
}