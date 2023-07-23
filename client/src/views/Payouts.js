import ReceiptManager from './../components/ReceiptManager';
import AttendingStaff from '../components/AttendingStaff';
import TipsManager from '../components/TipsManager';
import TipModal from "./../components/TipModal";
import uuid from "react-uuid";
import Modal from '../components/Modal';
import Button from '../components/common/Button/Button';
import tools from '../tools';
import dropdownIcon from '../assets/icons/dropdown-white.png';
import { useState, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';

function Payouts(props) {
    const { setIsBlurred, sections } = props;
    const { tips, archivedSessions, staff } = useContext(DynamicDataContext);

    const { getCurrentDate, sortArchivedArray } = tools;
    const [ modal, setModal ] = useState(null);

    const ordersTotal = archivedSessions.get.reduce((t, c) => t + c.amount_paid, 0);
    const tipsTotal = tips.get.reduce((total, current) => total + parseInt(current.amount), 0);
    const attendingStaff = staff.get.filter(s => s.is_attending);
    const absentStaff = staff.get.filter(s => !s.is_attending);
    const tipsAndOrders = parseInt(ordersTotal) + parseInt(tipsTotal);
    const perPerson = tipsAndOrders / attendingStaff.length;

    function handleModal(state) {
        setModal(state);
        state ? setIsBlurred(true) : setIsBlurred(false);
    }

    function handleAddTip() {
        handleModal({
            title: "Add Tip",
            content: <TipModal handleModal={handleModal} />
        });
    }

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


    return(
        <>
            {modal && 
                <Modal title={modal.title} closeButtonEvent={() => handleModal(null)}> 
                    {modal.content}
                </Modal>
            }

            <div className="Payouts">
                <div className="column left">
                    <section>
                        <div className="nav">
                            <span className="title">General Tips</span>
                            <Button type="constructive" clickEvent={handleAddTip}>Add Tip</Button>
                        </div>
                        <div className="content">
                            <TipsManager 
                                handleModal={handleModal} 
                                tips={tips}
                                tipsTotal={tipsTotal}
                            />
                        </div>
                    </section>

                    <section>
                    <div className="nav">
                            <span className="title">Payouts</span>
                            <Button type="constructive" clickEvent={() => handleAttendingModal(true)}>Add Staff</Button>
                        </div>

                        <div className="content">
                            <AttendingStaff 
                                staff={staff} 
                                handleModal={handleModal} 
                                tips={tips}
                                tipsTotal={tipsTotal}
                                ordersTotal={ordersTotal} 
                            />
                        </div>
                    </section>
                </div>

                <div className="column">
                    <section>
                        <div className="nav">
                            <span className="title">Receipts</span>
                            <Button type="neutral">
                                My Receipts
                                <img src={dropdownIcon} alt="Dropdown Chevron"/>
                            </Button>
                        </div>
                        <div className="content">
                            <ReceiptManager 
                                setIsBlurred={setIsBlurred}
                                handleModal={handleModal}
                                archivedSessions={archivedSessions}
                                sections={sections}
                                total={0}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Payouts;