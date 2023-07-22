import React, { useEffect, useState, useContext } from "react";
import { DynamicDataContext } from "../api/DynamicData";
import uuid from "react-uuid";

function AttendingStaff(props) {
    const { handleModal, ordersTotal, tipsTotal } = props;

    const { staff } = useContext(DynamicDataContext);
    
    const attendingStaff = staff.get.filter(s => s.is_attending);
    const absentStaff = staff.get.filter(s => !s.is_attending);
    const tipsAndOrders = parseInt(ordersTotal) + parseInt(tipsTotal);
    const perPerson = tipsAndOrders / attendingStaff.length;

    function handleAttendingModal(isVisible) {

        
        if (isVisible) {
            handleModal({
                title: "Add attending staff",
                content:
                <div className="addStaffModal">
                    {absentStaff.map(s => <button key={uuid()} onClick={() => staff.setAttribute(s, 'is_attending', true)}>{s.name}</button>)}
                </div>
            });
        } else {
            handleModal(null);
        }
    }
    

    return (
        <div className="AttendingStaff">
            <div className="list">
                {attendingStaff.map((s, i) =>
                <button 
                    className="delete-staff-button"
                    key={uuid()}
                    onClick={() => {staff.setAttribute(s, 'is_attending', false)}}
                >{s.name}</button>)}
                <button onClick={() => {handleAttendingModal(true)}} className="add-staff-button progressive">
                    Add
                </button>
            </div>

            <div className="calculations">
                <div>{`Orders: ${ordersTotal.toLocaleString("en-US")} gil`}</div>
                <div>{`General Tips: ${tipsTotal.toLocaleString("en-US")} gil`}</div>
                <div>{`Total: ${tipsAndOrders.toLocaleString("en-US")} gil divided among ${attendingStaff.length} people`}</div>
            </div>
            <div className="per-person">{`${Math.round(perPerson).toLocaleString("en-US")} gil / person`}</div>
        
        </div>
    )
}

export default AttendingStaff;