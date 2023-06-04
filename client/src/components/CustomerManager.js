import closeIcon from './../assets/icons/close.png';
import resetIcon from './../assets/icons/reset-black.png';
import trashcanIcon from './../assets/icons/trash-can-black.png';
import Customer from './Customer';
import ConfirmBox from './ConfirmBox';
import TabManager from './TabManager';

import { useState } from 'react';

export default function CustomerManager(props) {

    const {
        orders,
        selectedCustomer,
        customer,
        customers,
        setSelectedCustomerManager,
        setSelectedCustomer
    } = props;

    const [ viewTab, setViewTab ] = useState(false);
    const [confirmBox, setConfirmBox] = useState(null);
    const [isBlurred, setIsBlurred] = useState(false);

    function handleViewTab(state) {
        setViewTab(state);
    }

    function openConfirmBox(data) {
        setConfirmBox(data);
    }

    function closeConfirmBox() {
        setConfirmBox(null);
    };

    function handleDelete() {
        openConfirmBox({
            callback: function(){
                customers.remove(customer.id);
                setSelectedCustomerManager(null);
                closeConfirmBox();
            },
            closeConfirmBox: function(){closeConfirmBox()},
            title: "Are you sure?",
            message: `This will delete both the customer and any unpaid orders.`
        })
    }

    const deliveredOrders = orders.get.filter(order => order.delivered && order.customer === customer.id);

    let overriddenSession = null || customer.session;



    return (
        <div className="CustomerManager">
            {confirmBox !== null && <ConfirmBox data={confirmBox}/>}
            {isBlurred && <div className="blur" />}
            

            <div className="header">
                <button className="customerName" onClick={() => handleViewTab(true)}>Tab</button>

                <button className="closeButton" onClick={() => setSelectedCustomerManager(null)}>
                    <img src={closeIcon} alt="" />
                </button>
            </div>

            {viewTab &&
            <TabManager 
                deliveredOrdersInTable={deliveredOrders}
                customersInTable={[customer]}
                customers={customers}
                orders={orders}
                overriddenSession={overriddenSession}
                handleViewTab={handleViewTab}
                setConfirmBox={setConfirmBox}
            />}

            <br />
            <section className="OrderManager">
                <div className="customerContainer">
                    <Customer
                        orders={orders}
                        customers={customers}
                        customer={customer}
                        setSelectedCustomer={setSelectedCustomer}
                    />
                </div>
            </section>

            <nav className="bottomNav">
                <button onClick={() => handleDelete()} className="deleteButton destructive">
                    Delete
                </button>
            </nav>
        </div>
    )
}