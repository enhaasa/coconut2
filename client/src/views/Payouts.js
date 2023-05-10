import useArchivedOrders from './../hooks/useArchivedOrders';
import ReceiptManager from './../components/ReceiptManager';
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
                <Modal title="Parent component window title" closeButtonEvent={() => handleModal(null)}> 
                    <p>This is a child component</p>
                </Modal>
            }

            <div className="Payouts">
                <section>
                    <div className="title">
                        General Tips
                    </div>

                    <div className="content">
                        
                    </div>
                </section>

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
        </>
    );
}

export default Payouts;