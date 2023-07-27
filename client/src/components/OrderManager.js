import React, { useContext} from 'react';

//Contexts
import { DynamicDataContext } from '../api/DynamicData';

//Components
import Customer from './Customer';
import Button from './common/Button/Button';

//Tools
import uuid from 'react-uuid';

export default function OrderManager(props) {
    const { 
        openConfirmBox, 
        closeConfirmBox, 
        customersInSeating,
        unDeliveredOrdersInSeating, 
        updateUpdates, 
        seating, 
    } = props;

    const { 
        customers,
        seatings,
        orders
    } = useContext(DynamicDataContext);

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
                <div className="header">
                    <span className="label">Customers</span>
                    <Button type="constructive" clickEvent={() => handleAdd(seating)}>Add Customer</Button>
                </div>

                <div className="customer-container">
                    {
                        seating.customers.length === 0 ?
                        <span className="emptylist">The customers you're looking for is in another castle...</span> :
                        seating.customers.map(customer => (
                                <Customer 
                                    key={uuid()}
                                    customer={customer}
                                    orders={orders}
                                    updateUpdates={updateUpdates}
                                    confirmDeleteCustomer={confirmDeleteCustomer}
                                    unDeliveredOrdersInSeating={unDeliveredOrdersInSeating}
                                    unDeliveredOrderCustomersInSeating={unDeliveredOrderCustomersInSeating}
                                    customers={customers}
                                />
                        ))} 
                </div>
            </section>
        </>
    );
}