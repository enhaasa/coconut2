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
        customersInSeating,
        unDeliveredOrdersInSeating, 
        updateUpdates, 
        seating, 
    } = props;

    const { 
        customers,
        seatings,
        orders
    } = useContext(DynamicDataContext)

    function confirmDeleteCustomer(customer) {

        const checkedCustomerName = customer.name !== "" ? customer.name : "the customer";
        openConfirmBox({
            callback: function(){
                customers.remove(customer);

                if (customersInSeating.length -1 === 0) {
                    seatings.set(prev => {
                        prev[seating.id].session = null;
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

    let unDeliveredOrderCustomersInSeating = unDeliveredOrdersInSeating ? 
    unDeliveredOrdersInSeating.map(order => order.customer_id) : [];


    function handleAdd(seating) {
        const newCustomer = {
            name: "",
            section_id: seating.section_id,
            seating_id: seating.id,
            session_id: seating.session_id,
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
                    {seating.customers.map(customer => (
                            <Customer 
                                key={customer.id}
                                customer={customer}
                                orders={orders}
                                updateUpdates={updateUpdates}
                                confirmDeleteCustomer={confirmDeleteCustomer}
                                unDeliveredOrdersInSeating={unDeliveredOrdersInSeating}
                                unDeliveredOrderCustomersInSeating={unDeliveredOrderCustomersInSeating}
                                setSelectedCustomer={setSelectedCustomer}
                                customers={customers}
                            />
                       ))} 
                </div>
                

                <nav className="ordersNav">
                    <button className="icon" onClick={() => {handleAdd(seating)}}>
                        <img src={addcustomerIcon} alt="" />
                    </button>
                </nav>
            </section>
        </>
    );
}