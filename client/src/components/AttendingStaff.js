import { useEffect, useState } from "react";
import useArchivedOrders from "../hooks/useArchivedOrders";

function AttendingStaff(props) {
    const { staff, handleModal, ordersTotal } = props;
    const attendingStaff = staff.get.filter(s => s.isAttending);
    const absentStaff = staff.get.filter(s => !s.isAttending);
    const perPerson = ordersTotal / attendingStaff.length;

    function handleAttendingModal(isVisible) {
        if (isVisible) {
            handleModal({
                title: "Add attending staff",
                content:
                <div className="addStaffModal">
                    {absentStaff.map(s => <button onClick={() => toggleIsAttending(s, true)}>{s.name}</button>)}
                </div>
            });
        } else {
            handleModal(null);
        }
    }

    function toggleIsAttending(staffItem, isAttending) {
        staff.toggleIsAttending(staffItem.id, isAttending);
    }

    return (
        <div className="AttendingStaff">
            <div className="list">
                {attendingStaff.map((s, i) =>
                <button 
                    className="deleteStaffButton"
                    key={`attendingStaff${i}`}
                    onClick={() => {toggleIsAttending(s, false)}}
                >{s.name}</button>)}
                <button onClick={() => {handleAttendingModal(true)}} className="addStaffButton progressive">
                    Add
                </button>
            </div>

            <div className="perPerson">{`${Math.round(perPerson).toLocaleString("en-US")} gil / person`}</div>
        
        </div>
    )
}

export default AttendingStaff;