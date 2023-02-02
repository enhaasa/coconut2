import React from 'react';
import { Customer } from './Customer';


//import trashcanIcon from './../assets/icons/trash-can-black.png';
import addcustomerIcon from './../assets/icons/add-user-black.png';


export function OrderManager(props) {
    const { 
        openConfirmBox, 
        closeConfirmBox, 
        setSelectedCustomer,
        addCustomer,
        removeCustomer, 
        unDeliveredOrdersInTable, 
        customers, 
        table, 
        orders,
        deliverAll,
        editCustomerName,
        addOrder,
        removeOrder,
        deliverOrder
    } = props;

    function openMenu(customer) {
        setSelectedCustomer(customer);
    }

    function confirmDeleteCustomer(id, customerName) {

        const checkedCustomerName = customerName !== "" ? customerName : "the customer";
        openConfirmBox({
            callback: function(){
                removeCustomer(id, table);
                closeConfirmBox();
            },
            closeConfirmBox: function(){closeConfirmBox()},
            title: "Are you sure?",
            message: `Deleting ${checkedCustomerName} will also delete any unpaid orders.`
        })
    }

    let unDeliveredOrderCustomersInTable = unDeliveredOrdersInTable ? 
    unDeliveredOrdersInTable.map(order => order.customer) : [];

    return (
        <>
            <section className="OrderManager">
                <div className="customerContainer">
                    {customers.map(customer => (
                    
                        table.id === customer.table && 
                            <Customer 
                                customer={customer}
                                orders={orders}
                                confirmDeleteCustomer={confirmDeleteCustomer}
                                unDeliveredOrdersInTable={unDeliveredOrdersInTable}
                                unDeliveredOrderCustomersInTable={unDeliveredOrderCustomersInTable}
                                openMenu={openMenu}
                                deliverAll={deliverAll}
                                deliverOrder={deliverOrder}
                                editCustomerName={editCustomerName}
                                addOrder={addOrder}
                                removeOrder={removeOrder}
                            />
                       ))} 
                </div>
                

                <nav className="ordersNav">
                    <button className="icon" onClick={() => {addCustomer(table)}}>
                        <img src={addcustomerIcon} alt="" />
                    </button>
                </nav>
            </section>
        </>
    );
}