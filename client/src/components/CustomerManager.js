import closeIcon from './../assets/icons/close.png';
import resetIcon from './../assets/icons/reset-black.png';
import trashcanIcon from './../assets/icons/trash-can-black.png';
import Customer from './Customer';
import ConfirmBox from './ConfirmBox';
import TabManager from './TabManager';
import basketIcon from './../assets/icons/shopping-cart.png';

import { useState, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';


export default function CustomerManager(props) {

    const {
        customer,
        setSelectedCustomerManager,
        setSelectedCustomer
    } = props;

    const {
        orders,
        customers
    } = useContext(DynamicDataContext)

    const [ viewTab, setViewTab ] = useState(false);
    const [confirmBox, setConfirmBox] = useState(null);
    const [isBlurred, setIsBlurred] = useState(false);

    const unpaidOrders = orders.get.filter(order => !order.paid && order.delivered && order.customer === customer.id);
    const total = unpaidOrders.reduce((total, order) => total + order.price, 0);

    function handleViewTab(state) {
        setViewTab(state);
    };

    function openConfirmBox(data) {
        setConfirmBox(data);
    };

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
    };

    const deliveredOrders = orders.get.filter(order => order.delivered && order.customer === customer.id);

    let overriddenSession = customer.session || null;

    return (
        <div className="CustomerManager">
            {confirmBox !== null && <ConfirmBox data={confirmBox}/>}
            {isBlurred && <div className="blur" />}
            

            <div className="header">
                <span className="view-tab-container">
                        <button className="view-tab-button progressive" onClick={() => handleViewTab(true)}>
                            <span className="column">
                                <img src={basketIcon} alt="" />
                            </span>

                            <span className="column">
                                <span className="items">{unpaidOrders.length} items</span>
                                <span className="total">{total.toLocaleString("en-US")} gil</span>
                            </span>
                        </button>
                </span>

                <button className="close-button" onClick={() => setSelectedCustomerManager(null)}>
                    <img src={closeIcon} alt="" />
                </button>
            </div>

            {viewTab &&
            <TabManager 
                deliveredOrdersInSection={deliveredOrders}
                customersInSection={[customer]}
                overriddenSession={overriddenSession}
                handleViewTab={handleViewTab}
                setConfirmBox={setConfirmBox}
            />}

            <br />
            <section className="OrderManager">
                <div className="customer-container">
                    <Customer
                        customer={customer}
                        setSelectedCustomer={setSelectedCustomer}
                    />
                </div>
            </section>

            <nav className="bottom-nav">
                <button onClick={() => handleDelete()} className="delete-button destructive">
                    Delete
                </button>
            </nav>
        </div>
    )
}