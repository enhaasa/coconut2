import React, { useEffect, useState, useContext } from "react";
import { DynamicDataContext } from "../api/DynamicData";
import Table from "./common/Table/Table";
import TableItem from "./common/Table/TableItem";  
import Button from "./common/Button/Button";
import uuid from "react-uuid";      

function AttendingStaff(props) {
    const { handleModal, ordersTotal, tipsTotal } = props;

    const { staff } = useContext(DynamicDataContext);
    
    const attendingStaff = staff.get.filter(s => s.is_attending);
    const absentStaff = staff.get.filter(s => !s.is_attending);
    const tipsAndOrders = parseInt(ordersTotal) + parseInt(tipsTotal);
    const perPerson = tipsAndOrders / attendingStaff.length;
    
    
    return (
        <div className="AttendingStaff">
            
            <div className="list">

                <Table>
                    {attendingStaff.map((member) => (
                        <TableItem
                            key={uuid()}
                            cols={
                                [
                                    {
                                        type: 'text',
                                        content: member.name
                                    },
                                    {
                                        type: 'nav',
                                        content: 
                                        <>
                                            <Button
                                                type='destructive'
                                                clickEvent={() => {staff.setAttribute(member, 'is_attending', false)}}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    }

                                ]
                        } />
                    ))}
                </Table>



                {/*attendingStaff.map((s, i) =>
                <button 
                    className="delete-staff-button"
                    key={uuid()}
                    onClick={() => {staff.setAttribute(s, 'is_attending', false)}}
                    >{s.name}</button>)*/}
            </div>


            <div className="bottom-list">
                <div className="calculations">
                    <div>{`Orders: ${ordersTotal.toLocaleString("en-US")} gil`}</div>
                    <div>{`General Tips: ${tipsTotal.toLocaleString("en-US")} gil`}</div>
                    <div>{`Total: ${tipsAndOrders.toLocaleString("en-US")} gil divided among ${attendingStaff.length} people`}</div>
                </div>
                <div className="total">{`${Math.round(perPerson).toLocaleString("en-US")} gil / person`}</div>
            </div>
        
        </div>
    )
}

export default AttendingStaff;