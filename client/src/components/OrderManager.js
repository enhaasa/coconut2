import React from 'react';
import { Customer } from './Customer';


//import trashcanIcon from './../assets/icons/trash-can-black.png';
import addcustomerIcon from './../assets/icons/add-user-black.png';


export function OrderManager(props) {

    function openMenu(customer) {
        props.setSelectedCustomer(customer);
    }

    function confirmDeleteCustomer(id, customerName) {

        const checkedCustomerName = customerName !== "" ? customerName : "the customer";
        props.openConfirmBox({
            callback: function(){
                props.removeCustomer(id, props.table);
                props.closeConfirmBox();
            },
            closeConfirmBox: function(){props.closeConfirmBox()},
            title: "Are you sure?",
            message: `Deleting ${checkedCustomerName} will also delete any unpaid orders.`
        })
    }

    let unDeliveredOrderCustomersInTable = props.unDeliveredOrdersInTable ? 
    props.unDeliveredOrdersInTable.map(order => order.customer) : [];

    return (
        <>
            <section className="OrderManager">
                <div className="customerContainer">
                    {props.customers.map(customer => (
                    
                        props.table.id === customer.table && 
                            <Customer 
                                customer={customer}
                                orders={props.orders}
                                confirmDeleteCustomer={confirmDeleteCustomer}
                                unDeliveredOrdersInTable={props.unDeliveredOrdersInTable}
                                unDeliveredOrderCustomersInTable={unDeliveredOrderCustomersInTable}
                                openMenu={openMenu}
                                deliverAll={props.deliverAll}
                                deliverOrder={props.deliverOrder}
                                editCustomerName={props.editCustomerName}
                                addOrder={props.addOrder}
                                removeOrder={props.removeOrder}
                            />
                       ))} 
                </div>
                

                <nav className="ordersNav">
                    <button className="icon" onClick={() => {props.addCustomer(props.table)}}>
                        <img src={addcustomerIcon} alt="" />
                    </button>
                </nav>
            </section>
        </>
    );
}