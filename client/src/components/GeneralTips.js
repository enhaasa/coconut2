function GeneralTips(props) {

    const tips = [
        {
            id: "gsurhgisue",
            name: "Maggie Pie",
            amount: 65000,
            date: "2023-05-26 07:48"
        }
    ]

    return(
        <div className="GeneralTips">
            {tips.map(tip => (
              <button className="tip" key={tip.id}>
                <div className="name">{tip.name}</div>
                <div className="amount">{tip.amount.toLocaleString("en-US") + " gil"}</div>
              </button>  
            ))}
        </div>
    )
}

export default GeneralTips;