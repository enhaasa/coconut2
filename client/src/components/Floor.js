import React, { useLayoutEffect, useRef } from 'react';
import Table from './Table';
import BarManager from './BarManager';
import gsap from 'gsap';
import animations from '../animations';

import overlay from './../assets/icons/dark-fabric.png';

export default function Floor(props) {
    const {
        floor,
        tables,
        loggedInAs,
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

    return (
        <div className="Floor" ref={FloorRef}>
            <img className="overlay" src={overlay} alt="" />
            {floor.schematics && <img className="floorImage" src={floor.schematics} alt="" />}

            {floor.type === "restaurant" ? tables.get.map((table) => {
                if (floor.name === table.floor) {
                    return (
                        <Table 
                            loggedInAs={loggedInAs}
                            table={table}
                            maxDeliveryTime={maxDeliveryTime}
                            colorset={colorset} 
                            setSelectedTable={setSelectedTable}
                            key={table.id}
                            customers={customers}
                            orders={orders}
                        />
                    ) 
                } 

                return null;
            }) : <BarManager 
                    customers={customers} 
                    setSelectedCustomer={setSelectedCustomer} 
                    setSelectedCustomerManager={setSelectedCustomerManager}
                />
            }
        </div>
    );
}