import React, { useContext } from 'react';

//Components
import Order from '../Order';
import Service from '../common/Service/Service';
import Button from '../common/Button/Button';
import Table from '../common/Table/Table';
import DeleteButton from '../common/Button/_DeleteButton';
import Name from './_Name';

//Tools
import uuid from 'react-uuid';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';

export default function Customer(props) {
    const {
        confirmDeleteCustomer,
        customer,
        handleModal,
    } = props;

    const {
        customers,
        orders,
    } = useContext(DynamicDataContext);

    const {
        setSelectedCustomer,
        selectedCustomer,
        setItemInMovement,
        setSelectedSeating,
    } = useContext(ControlStatesContext);

    const { uncompletedServices } = customer;
    let undeliveredOrders = [];
    customer.undeliveredOrders.forEach(order => {
        const currentOrder = undeliveredOrders.find(parsedOrder => 
            parsedOrder.name === order.name && parsedOrder.price === order.price);

        if (!currentOrder) {
            undeliveredOrders.push({
                amount: 1,
                name: order.name,
                item: order.item,
                price: order.price,
                total: order.price,
                units: [order]
            })
        } else {
            currentOrder.amount += 1;
            currentOrder.total += order.price;
            currentOrder.units.push(order);
        }
    });

    function handleMoveCustomer() {
        setItemInMovement({
            type: 'customer', 
            item: customer,
            moveFunction: customers.move
        });
        setSelectedSeating(null);
        setSelectedCustomer(null);
    }
      
    function openMenu() {
        setSelectedCustomer(customer);
    }

    return (
        <div className={`Customer${selectedCustomer && selectedCustomer.id === customer.id ? ' active' : ''}`} >
            
            <nav className='name-nav'>
                <Name customer={customer} key={`editName${customer.id}`} />

                <DeleteButton type='destructive' clickEvent={() => {confirmDeleteCustomer(customer)}} />
                <Button type='neutral' clickEvent={handleMoveCustomer}>Relocate</Button>
            </nav>

            {customer.undeliveredOrders.length > 0 &&
                <div className='items'>
                    <div className='title'>Orders</div>
                    <Table>
                        {undeliveredOrders.map((order) => (
                            <Order 
                                handleModal={handleModal}
                                key={uuid()}
                                order={order} 
                            />
                        ))}
                    </Table>
                </div>
            }

            {customer.uncompletedServices.length > 0 &&
                <div className='items'>
                    <div className='title'>Services</div>
                    <Table>
                        {uncompletedServices.map((service) => (
                            <Service 
                                handleModal={handleModal}
                                key={uuid()}
                                service={service}
                            />
                        ))}

                    </Table>

                </div>
            }

            <nav className='customer-nav'>
                <span className='col'>
                    {
                        selectedCustomer && selectedCustomer.id === customer.id 
                        ? <Button type='inactive'>Adding...</Button>
                        : <Button type='constructive' clickEvent={() => {openMenu(customer)}}>Add</Button>
                    }
                </span>

                <span className='col'>
                {
                    customer.undeliveredOrders.length > 0 &&
                        <Button 
                        type='neutral' 
                        ID={`DeliverAllByCustomer${customer.id}`}
                        pendingResponseClickEvent={{
                            args: [{
                                customer
                            }],
                            event: orders.deliverAllByCustomer
                        }}>Deliver All</Button>
                }
                </span>
            </nav>
        </div>
    );
}




