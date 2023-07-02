import React from 'react';
import Customer from './Customer';
import uuid from 'react-uuid';

//import trashcanIcon from './../assets/icons/trash-can-black.png';
import addcustomerIcon from './../assets/icons/add-user-black.png';


export default function OrderManager(props) {
    const { 
        openConfirmBox, 
        closeConfirmBox, 
        setSelectedCustomer,
        customersInTable,
        unDeliveredOrdersInTable, 
        updateUpdates,
        customers, 
        table, 
        tables,
        orders
    } = props;

    function confirmDeleteCustomer(id, customerName) {

        const checkedCustomerName = customerName !== "" ? customerName : "the customer";
        openConfirmBox({
            callback: function(){
                customers.remove(id, table);

                if (customersInTable.length -1 === 0) {
                    tables.set(prev => {
                        prev[table.id].session = null;
                        return [...prev];
                    });
                }

                closeConfirmBox();
            },
            closeConfirmBox: function(){closeConfirmBox()},
            title: "Are you sure?",
            message: `Deleting ${checkedCustomerName} will also delete any unpaid orders.`
        })
    }

    let unDeliveredOrderCustomersInTable = unDeliveredOrdersInTable ? 
    unDeliveredOrdersInTable.map(order => order.customer) : [];

    function handleAdd(table) {
        const newCustomer = {
            name: "",
            floor: table.floor,
            table: table.id,
            id: uuid()
          }

          customers.add(newCustomer)
    }

    return (
        <>
            <section className="OrderManager">
                <div className="header cursive">
                    Customers
                </div>

                <div className="customerContainer">
                    {customers.get.map(customer => (
                    
                        table.id === customer.table && 
                            <Customer 
                                key={customer.id}
                                customer={customer}
                                orders={orders}
                                updateUpdates={updateUpdates}
                                confirmDeleteCustomer={confirmDeleteCustomer}
                                unDeliveredOrdersInTable={unDeliveredOrdersInTable}
                                unDeliveredOrderCustomersInTable={unDeliveredOrderCustomersInTable}
                                setSelectedCustomer={setSelectedCustomer}
                                customers={customers}
                            />
                       ))} 
                </div>
                

                <nav className="ordersNav">
                    <button className="icon" onClick={() => {handleAdd(table)}}>
                        <img src={addcustomerIcon} alt="" />
                    </button>
                </nav>
            </section>
        </>
    );
}