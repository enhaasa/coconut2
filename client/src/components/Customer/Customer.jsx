import React, { useRef, useLayoutEffect, useContext, useState, useEffect } from 'react';

//Components
import Order from '../Order';
import Service from '../common/Service/Service';
import Button from '../common/Button/Button';
import Table from '../common/Table/Table';
import DeleteButton from '../common/Button/_DeleteButton';

//Tools
import uuid from 'react-uuid';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';

export default function Customer(props) {
    const {
        confirmDeleteCustomer,
        customer,
        handleItemInfo,
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

    const [ nameBuffer, setNameBuffer ] = useState(customer.name);
    
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

    let timer = useRef();

    function handleNamePaste(event) {
        const pastedValue = event.clipboardData.getData('text');
        if (pastedValue.length + customer.name.length > 50) {
          setNameBuffer(pastedValue);
          event.preventDefault();
        }
    }

    function handleNameChange(event) {
        const { value } = event.target;
        if (value.length <= 50) {
            setNameBuffer(value);
        
            if (timer.current) {
            clearTimeout(timer.current);
            }
        
            const currentNameBuffer = value; 
            timer.current = setTimeout(() => {
            customers.editName(customer, currentNameBuffer); 
            }, 500);
        }
    }

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
                <input 
                    spellCheck={false}
                    type='text' 
                    value={nameBuffer} 
                    placeholder='Enter name...' 
                    maxLength={50}
                    onPaste={handleNamePaste}
                    onChange={handleNameChange}>
                </input>

                <Button type='neutral' clickEvent={handleMoveCustomer}>Relocate</Button>
                <DeleteButton type='destructive' clickEvent={() => {confirmDeleteCustomer(customer)}} />
            </nav>

            {customer.undeliveredOrders.length > 0 &&
                <div className='orders'>
                    <Table>
                        {undeliveredOrders.map((order) => (
                            <Order 
                                handleItemInfo={handleItemInfo}
                                key={uuid()}
                                order={order} 
                            />
                        ))}
                    </Table>
                </div>
            }

            {customer.uncompletedServices.length > 0 &&
                <div className='services'>
                    <Table>
                        {uncompletedServices.map((service) => (
                            <Service 
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
                        : <Button type='constructive' clickEvent={() => {openMenu(customer)}}>Add Order</Button>
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




