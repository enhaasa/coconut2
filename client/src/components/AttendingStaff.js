import { useEffect, useState } from "react";

function AttendingStaff(props) {
    const { staff, handleModal } = props;
    const attendingStaff = staff.get.filter(s => s.isAttending);
    const absentStaff = staff.get.filter(s => !s.isAttending);

    function handleAttendingModal(isVisible) {
        if (isVisible) {
            handleModal({
                title: "Add attending staff",
                content:
                <>
                    {absentStaff.map(s => <button onClick={() => toggleIsAttending(s, true)}>{s.name}</button>)}
                </>
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
    )
}

export default AttendingStaff;