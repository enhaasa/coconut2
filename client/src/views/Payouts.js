import useArchivedOrders from './../hooks/useArchivedOrders';
import ReceiptManager from './../components/ReceiptManager';
import { useState } from 'react';

function Payouts(props) {
    const { staff, archivedOrders, setIsBlurred } = props;
    const [ modal, setModal ] = useState(null);

    

    return(
        <>
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
                        />
                    </div>
                </section>
            </div>
        </>
    );
}

export default Payouts;