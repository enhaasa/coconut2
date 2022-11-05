import React, { useState } from 'react';

export function TableManager(props) {


    return (
        props.ID !== null&&
        <div className="TableManager">
            <span className="number">{props.ID +1}</span>
            <nav className="navbar"></nav>

            

        </div>
    );
}