import CustomerManager from "./CustomerManager";
import customerIcon from './../assets/icons/mediumuser-black.png';
import addcustomerIcon from './../assets/icons/add-user-white.png';
import tools from "../tools";

import { useState, useEffect } from 'react';

export default function BarManager(props) {

    const { getFirstName, getLastNames } = tools;

    function handleAdd() {
        customers.add({floor: floor.name, table: null});
    }

    const { 
        floor,
        customers,  
        setSelectedCustomerManager 
    } = props;

    return (
        <div className="BarManager">

            <div className="customerList">

            {customers.get.filter(c => c.floor === floor.name).map(customer => (
                    <span className="customerContainer" key={customer.id}>
                        <button 
                            onClick={() => setSelectedCustomerManager(customer)}
                            className="button"
                        ><img src={customerIcon} />
                        </button>

                        {customer.name !== "" && <div className="name">
                            {`${getFirstName(customer.name)} ${getLastNames(customer.name).join("").charAt(0)}`}
                        </div>}
                    </span>

                ))
                }
            </div>

            <div className="addCustomerButtonContainer">
                <button className="addCustomerButton" onClick={() => handleAdd()}>
                    <img src={addcustomerIcon} />
                </button>
            </div>
        </div>
    )
}