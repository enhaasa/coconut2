import React from 'react';
import tools from '.././tools';
import clockIcon from './../assets/icons/clock-black.png';

export default function Receipt(props) {
    const { customers } = props;
    const { getFirstName, getLastNames } = tools;

    const { session, time, table } = customers[0];

    const total = customers.reduce((total, customer) => (customer.total + total), 0).toLocaleString("en-US");

    let names = customers.map(customer => `${getFirstName(customer.customerName)} ${getLastNames(customer.customerName).join("").charAt(0)}`);
    names = [...new Set(names)];

    return (
        <div className="Receipt">
            <div className="name">{names.join(", ")}</div>

            <div className="link">
                <a href={`https://cocosoasis.info/r.html?id=${session}`}
                target="_blank" rel="noopener noreferrer">{`Receipt Link`}</a>
            </div>
            <div className="data">
                <span className="time">
                    <img src={clockIcon}></img>{tools.epochToTime(parseInt(time)).slice(0, -3)}
                </span>
                <span className="table">
                    Table {table +1}
                </span>
                
            </div>
            <div className="total">
                
                <span className="text">Total:</span>
                <span className="amount">{`${total} gil`}</span>
                
            </div>
        </div>
    );
}



