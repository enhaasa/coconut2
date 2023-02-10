import React, { useLayoutEffect, useRef } from 'react';
import Table from './Table';
import gsap from 'gsap';
import animations from '../animations';

import overlay from './../assets/icons/dark-fabric.png';

export default function Floor(props) {

    const FloorRef = useRef();
    useLayoutEffect(() => {
        gsap.from(FloorRef.current, animations.fadeSlow);

        return () => {
            gsap.to(FloorRef.current, animations.fadeSlow);
        }
    }, []);

    return (
        <div className="Floor" ref={FloorRef}>
            <img className="overlay" src={overlay} alt="" />
            <img className="floorImage" src={props.floor.schematics} alt="" />
            
            {!props.floor.schematics && <em>Loading...</em>}

            {props.tables.map((table) => {

                if (props.floor.type === table.floor) {
                    return (
                        <Table 
                            loggedInAs={props.loggedInAs}
                            table={table}
                            maxDeliveryTime={props.maxDeliveryTime}
                            colorset={props.colorset} 
                            setSelectedTable={props.setSelectedTable}
                            key={table.id}
                            customers={props.customers}
                            orders={props.orders}
                        />
                    )
                } 

                return null;
            })}
        </div>
    );
}