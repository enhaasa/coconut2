import TipModal from "./TipModal";

function TipsManager(props) {
    const { tips, tipsTotal, handleModal, tipsFromStartDate } = props;

    function handleEdit(tip) {
        handleModal({
            title: "Edit Tip",
            content: <TipModal tip={tip} tips={tips} handleModal={handleModal} />
        });
    }

    function handleAdd() {
        handleModal({
            title: "Add Tip",
            content: <TipModal tips={tips} handleModal={handleModal} />
        });
    }


    return(
        <div className="TipsManager">
            <div className="list">
                {tipsFromStartDate.map(tip => (
                <button className="tip inactive" key={tip.id} onClick={() => handleEdit(tip)}>
                    <div className="name">{tip.name}</div>
                    <div className="amount">{tip.amount.toLocaleString("en-US") + " gil"}</div>
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