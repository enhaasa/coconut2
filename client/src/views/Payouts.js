import ReceiptManager from './../components/ReceiptManager';
import AttendingStaff from '../components/AttendingStaff';
import TipsManager from '../components/TipsManager';
import Modal from '../components/Modal';
import tools from '../tools';
import { useState, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';

function Payouts(props) {
    const { setIsBlurred, floors } = props;
    const { tips, archivedSessions, staff } = useContext(DynamicDataContext);

    const { getCurrentDate, sortArchivedArray } = tools;
    const [ modal, setModal ] = useState(null);

    function handleModal(state) {
        setModal(state);
        state ? setIsBlurred(true) : setIsBlurred(false);
    }

    const startDateEpoch = getCurrentDate(date => date -1); //Set date filtering offset in days


    const ordersTotal = archivedSessions.get.reduce((t, c) => t + c.amount_paid, 0);

    //let archivedSessions = archivedOrdersFromStartDate.map(order => order.session);
    //archivedSessions = [...new Set(archivedSessions)];

    const tipsTotal = tips.get.reduce((total, current) => total + parseInt(current.amount), 0);

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
                            <TipsManager 
                                handleModal={handleModal} 
                                tips={tips}
                                tipsTotal={tipsTotal}
                            />
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
                                tips={tips}
                                tipsTotal={tipsTotal}
                                ordersTotal={ordersTotal} 
                            />
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
                                setIsBlurred={setIsBlurred}
                                handleModal={handleModal}
                                archivedSessions={archivedSessions}
                                floors={floors}
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