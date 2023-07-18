import { useState, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import tools from '../tools';

function TipModal(props) {
    const { handleModal, tip } = props;

    const { tips } = useContext(DynamicDataContext);

    const [ name, setName ] = useState(tip ? tip.name : "");
    const [ amount, setAmount ] = useState(tip ? tip.amount : 0);

    function handleNameChange(newValue) {
        setName(newValue);
    }
    function handleAmountChange(newValue) {
        setAmount(newValue);
    }

    function handleSubmit() {
        if(tip) {
            tips.edit({
                tip: tip, 
                newName: !name ? "Anonymous" : name,
                newAmount:!amount ? 0 : parseInt(amount)
            });
            handleModal(null);
        } else {
            tips.add({
                name: !name ? "Anonymous" : name, 
                amount: !amount ? 0 : amount, 
            });
            handleModal(null);
        }
    }

    function handleDelete() {
        tips.remove(tip);
        handleModal(null);
    }

    return(
        <div className="TipModal">
            <div className="row">
                <label>Name: </label>
                <input 
                type="text"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder={"Enter name..."}
                />
            </div>

            <div className="row">
                <label>Amount: </label>
                <input 
                    type="number"
                    value={amount}
                    onChange={e => handleAmountChange(e.target.value)}
                    placeholder={"Enter amount..."}
                />
            </div>

            <div className="submitContainer">
                <button 
                    className="submit constructive"
                    onClick={() => handleSubmit()}
                >{tip ? "Update" : "Add Tip"}</button>     

                {tip && 
                    <button
                        className="destructive"
                        onClick={() => handleDelete()}
                    >Delete</button>
                }
            </div>
        </div>
    )
}

export default TipModal;