import React, { useContext } from 'react';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Components
import Customer from '../Customer/Customer';
import Button from '../common/Button/Button';

//Tools
import uuid from 'react-uuid';

export default function OrderManager(props) {
    const { 
        openConfirmBox, 
        closeConfirmBox, 
        seating, 
        handleItemInfo,
    } = props;

    const { 
        customers,
        orders,
    } = useContext(DynamicDataContext);

    function confirmDeleteCustomer(customer) {
        const checkedCustomerName = customer.name !== '' ? customer.name : 'the customer';
        openConfirmBox({
            pendingRequestEvent: {
                args: [customer],
                event: customers.remove
            },
            closeConfirmBox: function(){closeConfirmBox()},
            title: 'Are you sure?',
            message: `Deleting ${checkedCustomerName} will also delete any unpaid orders.`
        })
    }

    return (
        <>
            <section className='OrderManager'>
                <div className='header'>
                    <span className='label'>Customers</span>
                    <Button 
                        type='constructive' 
                        ID='AddCustomer'
                        pendingResponseClickEvent={{
                            args: [{
                                name: '',
                                section_id: seating.section_id,
                                seating_id: seating.id,
                                realm_id: 1
                            }],
                            event: customers.add
                        }}>Add Customer</Button>
                </div>

                <div className='customer-container'>
                    {
                        seating.customers.length === 0 ?
                        <span className='emptylist'>The customers you're looking for is in another castle...</span> :
                        seating.customers.map(customer => (
                            <Customer 
                                key={uuid()}
                                customer={customer}
                                handleItemInfo={handleItemInfo}
                                orders={orders}
                                confirmDeleteCustomer={confirmDeleteCustomer}
                                customers={customers}
                            />
                        ))} 
                </div>
            </section>
        </>
    );
}