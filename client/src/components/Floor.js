import React, { useLayoutEffect, useRef } from 'react';
import Table from './Table';
import BarManager from './BarManager';
import gsap from 'gsap';
import animations from '../animations';

import overlay from './../assets/icons/dark-fabric.png';

export default function Floor(props) {
    const {
        section,
        tables,
        maxDeliveryTime,
        colorset,
        setSelectedTable,
        setSelectedCustomer,
        setSelectedCustomerManager,
        customers,
        orders
    } = props;


    const FloorRef = useRef();
    /*
    useLayoutEffect(() => {
        gsap.from(FloorRef.current, animations.fadeSlow);

        return () => {
            gsap.to(FloorRef.current, animations.fadeSlow);
        }
    }, []);
    */


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
                {/*section.schematics && <img className="floorImage" src={floor.schematics} alt="" />*/}

                {tablesInSection.map((table) => (
                        <Table 
                            table={table}
                            maxDeliveryTime={maxDeliveryTime}
                            colorset={colorset} 
                            setSelectedTable={setSelectedTable}
                            key={table.id}
                            customers={customers}
                            orders={orders}
                        />
                    )) 
                }
            
            </div>
        
    );
}