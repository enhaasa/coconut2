import React from 'react';
import { Table } from './Table';

import overlay from './../assets/icons/dark-fabric.png';

export function Floor(props) {

    return (
        <div className="Floor">
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