import tools from "../tools";
import { useState } from 'react';

function ReceiptModal(props) {
    const { orders, session } = props;

    const total = orders.reduce((total, order) => (total + order.price), 0);
    const [ amountPaid, setAmountPaid ] = useState(total);
    const tips = amountPaid - total < 0 ? 0 : amountPaid - total;

    function handleAmountPaid(amount) {
        setAmountPaid(amount);
    }

    return(
        <div className="ReceiptModal">
            <table className="itemTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Total</th>
                    </tr>
                </thead>
            
                <tbody>
                    {tools.sortArray(orders).map(order => (  
                        <tr key={order.id}>
                            <td>{order.name}</td>
                            <td>{order.price.toLocaleString("en-US")} gil</td>
                            <td>{order.amount}</td>
                            <td>{order.total.toLocaleString("en-US")} gil</td>
                        </tr>
                                
                    ))}
                </tbody>
                <tfoot>
                    {/*
                    <tr>
                        <td>Tips:</td>
                        <td></td>
                        <td></td>
                        <td>{tips.toLocaleString("en-US") + " gil"}</td>
                    </tr>
                    */}
                    <tr>
                        <td>Total:</td>
                        <td></td>
                        <td></td>
                        <td>{tools.formatStringAsPrice(amountPaid.toString()) + " gil"}</td>
                    </tr>
                </tfoot>
            </table>

            {/*
            <div className="paidAmount">
                <label>Amount paid:</label> 
                <input type="number" 
                value={amountPaid} 
                onChange={(e) => handleAmountPaid(e.target.value)}></input>
                <button disabled={amountPaid === total ? true : false}>Save</button>
            </div>
            <br />
            */}

            <div className="receiptRP">
                
                <a href={`https://cocosoasis.info/r.html?id=${session}`}
                target="_blank" rel="noopener noreferrer">{`Receipt Link`}</a>

                <textarea 
                    value={`/em hands over the tab: cocosoasis.info/r.html?id=${session} ((${total.toLocaleString("en-US")} gil))`} 
                    contentEditable={false}
                    spellCheck={false}
                />
            </div>
            
        </div>
    );
}

export default ReceiptModal;