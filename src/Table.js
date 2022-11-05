import React, { useEffect, useState } from 'react';

export function Table(props) {

    const isAvailable = true;
    const reservation = "";


    return (
        <button 
            className="Table" 
            onClick={() => {props.setSelectedTable(props.ID)}}
            key={props.ID}
            style={{left:props.posX, top:props.posY}}
            >
            <span className="number">
                {props.ID + 1}
            </span>
        </button>
    );
}