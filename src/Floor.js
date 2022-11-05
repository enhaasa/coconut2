import React, { useState } from 'react';
import { Table } from './Table';


export function Floor(props) {

    return (
        <div className="Floor" style={{
            backgroundImage: `url(${props.floor.schematics})`
        }}>
            {!props.floor.schematics && <em>Loading...</em>}
            {props.tables.map((table, index) => {

                if (props.floor.type === table.type) {
                    return (
                        <Table 
                            ID={index}
                            posX={table.posX} 
                            posY={table.posY}
                            key={table.id}
                            setSelectedTable={props.setSelectedTable}
                        />
                    )
                }
            })}
        </div>
    );
}