import useArchivedOrders from './../hooks/useArchivedOrders';
import ReceiptManager from './../components/ReceiptManager';
import AttendingStaff from '../components/AttendingStaff';
import GeneralTips from '../components/GeneralTips';
import Modal from '../components/Modal';
import { useState } from 'react';

function Payouts(props) {
    const { staff, archivedOrders, setIsBlurred } = props;
    const [ modal, setModal ] = useState(null);

    function handleModal(state) {
        setModal(state);
        state ? setIsBlurred(true) : setIsBlurred(false);
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
                        <div className="title">
                            General Tips
                        </div>
                        <div className="content">
                            <GeneralTips />
                        </div>
                    </section>

                    <section>
                        <div className="title">
                            Attending Staff
                        </div>

                        <div className="content">
                            <AttendingStaff staff={staff} handleModal={handleModal}/>
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
                            />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Payouts;