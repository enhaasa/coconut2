import React from 'react';
import tools from '.././tools';

export default function Receipt(props) {
    const { customers } = props;
    const { getFirstName, getLastNames } = tools;

    const session = customers[0].session;
    const total = customers.reduce((total, customer) => (customer.total + total), 0).toLocaleString("en-US");

    let names = customers.map(customer => `${getFirstName(customer.customerName)} ${getLastNames(customer.customerName).join("").charAt(0)}`);
    names = [...new Set(names)];

    return (
        <div className="Receipt">
            <div className="name">{names.join(", ")}</div>
            <div className="link">
                <a href={`https://cocosoasis.info/r.php?id=${session}`}>{`Receipt Link`}</a>
            </div>
            <div className="total">
                {/*
                <span className="text">Total:</span>
                <span className="amount">{`${total} gil`}</span>
                */}
            </div>
        </div>
    );
}



