import React, { useContext} from 'react';
import { DynamicDataContext } from '../api/DynamicData';
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
        table, 
    } = props;

    const { 
        customers,
        tables,
        orders
    } = useContext(DynamicDataContext)

    function confirmDeleteCustomer(customer) {

        const checkedCustomerName = customer.name !== "" ? customer.name : "the customer";
        openConfirmBox({
            callback: function(){
                customers.remove(customer);

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
    unDeliveredOrdersInTable.map(order => order.customer_id) : [];


    function handleAdd(table) {
        const newCustomer = {
            name: "",
            section_id: table.section_id,
            table_id: table.id,
            session_id: table.session_id,
            realm_id: 1,
            uuid: uuid()
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
                    
                        table.id === customer.table_id && 
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