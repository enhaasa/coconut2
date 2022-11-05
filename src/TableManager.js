import React, { useState } from 'react';

export function TableManager(props) {


    return (
        props.ID !== null&&
        <div className="TableManager">

            <div className="title">
                <span className="tablenumber">{props.ID +1}</span>
            </div>
            <nav className="navbar">
                <div className="navrow">
                    <span className="navsection">
                        <button>Available</button> 
                        <button>Taken</button> 
                    </span>

                    <span className="navsection">
                        <button>Reserved</button>
                    </span>
                </div>

                <div className="navrow">
                    <span>Assigned:</span>
                    <select name="waiters" id="waiters">
                        {props.staff.map(staff => {
                            return (
                                staff.positions.includes("waiter") && <option>{staff.name}</option>
                            )
                        })}
                    </select>
                </div>

            </nav>


        </div>
    );
}