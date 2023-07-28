import { sortArray } from "../tools";
import { useState } from 'react';
import uuid from "react-uuid";

function ReceiptModal(props) {
    const { session, archivedSessions, handleModal } = props;

    const total = session.price;
    const [ amountPaid, setAmountPaid ] = useState(session.amount_paid);
    const tips = amountPaid - total < 0 ? 0 : amountPaid - total;
    

    function handleAmountPaid(amount) {
        setAmountPaid(amount);
    }
    function handleSave() {
        archivedSessions.setAmountPaid(session, parseInt(amountPaid));
        handleModal(null);
    }

    return(
        <div className="ReceiptModal">
            <table className="item-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Total</th>
                    </tr>
                </thead>
            
                <tbody>
                    {sortArray(session.orders).map(order => (  
                        <tr key={uuid()}>
                            <td>{order.name}</td>
                            <td>{order.price.toLocaleString("en-US")} gil</td>
                            <td>{order.amount}</td>
                            <td>{order.total.toLocaleString("en-US")} gil</td>
                        </tr>
                                
                    ))}
                </tbody>
                <tfoot>
                    {
                    <tr>
                        <td>Tips:</td>
                        <td></td>
                        <td></td>
                        <td>{tips.toLocaleString("en-US") + " gil"}</td>
                    </tr>
                    }
                    <tr>
                        <td>Total:</td>
                        <td></td>
                        <td></td>
                        <td>{session.amount_paid.toLocaleString("en-us") + " gil"}</td>
                    </tr>
                </tfoot>
            </table>

            
            <div className="paid-amount">
                <label>Amount paid:</label> 
                <input type="number" 
                    value={amountPaid} 
                    onChange={(e) => handleAmountPaid(e.target.value)}>
                </input>
                <button 
                    onClick={() => handleSave()} 
                    disabled={amountPaid === total ? true : false}
                >Save</button>
            </div>
            <br />
            

            <div className="receipt-RP">
                
                <a href={`https://cocosoasis.info/r.html?id=${session.id}`}
                target="_blank" rel="noopener noreferrer">{`Receipt Link`}</a>

                <textarea 
                    value={`/em hands over the tab: cocosoasis.info/r.html?id=${session.id} ((${total.toLocaleString("en-US")} gil))`} 
                    readOnly
                    contentEditable={false}
                    spellCheck={false}
                />
            </div>
            
        </div>
    );
}

export default ReceiptModal;