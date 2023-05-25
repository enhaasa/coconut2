import useArchivedOrders from './../hooks/useArchivedOrders';
import ReceiptManager from './../components/ReceiptManager';
import AttendingStaff from '../components/AttendingStaff';
import GeneralTips from '../components/GeneralTips';
import Modal from '../components/Modal';
import tools from '../tools';
import { useState } from 'react';

function Payouts(props) {
    const { staff, archivedOrders, setIsBlurred } = props;
    const { getCurrentDate, sortArchivedArray } = tools;
    const [ modal, setModal ] = useState(null);

    function handleModal(state) {
        setModal(state);
        state ? setIsBlurred(true) : setIsBlurred(false);
    }

    const startDateEpoch = getCurrentDate(date => date -1); //Set date filtering offset in days
    const archivedOrdersFromStartDate = sortArchivedArray(archivedOrders.get.map(order => (
        order.date > startDateEpoch && order
    ))).slice(1);

    const total = archivedOrdersFromStartDate.reduce((t, c) => t + c.price, 0);
    let archivedSessions = archivedOrdersFromStartDate.map(order => order.session);
    archivedSessions = [...new Set(archivedSessions)];

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
                        <div className="title">
                            General Tips
                        </div>
                        <div className="content">
                            <GeneralTips />
                        </div>
                    </section>

                    <section>
                        <div className="title">
                            Payouts
                        </div>

                        <div className="content">
                            <AttendingStaff 
                                staff={staff} 
                                handleModal={handleModal} 
                                archivedOrders={archivedOrders}
                                ordersTotal={total} />
                        </div>
                    </section>
                </div>

                <div className="column">
                    <section>
                        <div className="title">
                            Receipts
                        </div>
                        <div className="content">
                            <ReceiptManager 
                                archivedOrders={archivedOrders} 
                                setIsBlurred={setIsBlurred}
                                handleModal={handleModal}
                                archivedOrdersFromStartDate={archivedOrdersFromStartDate}
                                archivedSessions={archivedSessions}
                                total={total}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Payouts;