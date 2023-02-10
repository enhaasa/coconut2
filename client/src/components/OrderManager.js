import React from 'react';
import Customer from './Customer';


//import trashcanIcon from './../assets/icons/trash-can-black.png';
import addcustomerIcon from './../assets/icons/add-user-black.png';


export default function OrderManager(props) {
    const { 
        openConfirmBox, 
        closeConfirmBox, 
        setSelectedCustomer,
        unDeliveredOrdersInTable, 
        customers, 
        table, 
        orders,
        handleOrders,
        handleCustomers
    } = props;

    function openMenu(customer) {
        setSelectedCustomer(customer);
    }

    function confirmDeleteCustomer(id, customerName) {

        const checkedCustomerName = customerName !== "" ? customerName : "the customer";
        openConfirmBox({
            callback: function(){
                handleCustomers.remove(id, table);
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
                                handleOrders={handleOrders}
                                handleCustomers={handleCustomers}
                            />
                       ))} 
                </div>
                

                <nav className="ordersNav">
                    <button className="icon" onClick={() => {handleCustomers.add(table)}}>
                        <img src={addcustomerIcon} alt="" />
                    </button>
                </nav>
            </section>
        </>
    );
}