import React, { useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import TipModal from "./TipModal";
import tools from "../tools";
import uuid from 'react-uuid';

function TipsManager(props) {
    const { tipsTotal, handleModal } = props;

    const { tips } = useContext(DynamicDataContext);

    function handleEdit(tip) {
        handleModal({
            title: "Edit Tip",
            content: <TipModal tip={tip} handleModal={handleModal} />
        });
    }

    function handleAdd() {
        handleModal({
            title: "Add Tip",
            content: <TipModal handleModal={handleModal} />
        });
    }


    return(
        <div className="TipsManager">
            <div className="list">
                {tips.get.map(tip => (
                <button className="tip inactive" key={uuid()} onClick={() => handleEdit(tip)}>
                    <div className="name">{tip.name}</div>
                    <div className="amount">{tools.formatStringAsPrice(tip.amount.toString()) + " gil"}</div>
                </button>  
                ))}
                <button className="progressive" onClick={() => handleAdd()}>
                    Add
                </button>
            </div>

            <div className="total">
                {`Total: ${tipsTotal.toLocaleString("en-US")} gil`}
            </div>
        </div>
    )
}

export default TipsManager;