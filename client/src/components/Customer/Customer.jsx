import React, { useRef, useLayoutEffect, useContext, useState } from 'react';

//Components
import Order from '../Order';
import Button from '../common/Button/Button';
import Table from '../common/Table/Table';

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
    
    let undeliveredOrders = [];
    customer.undeliveredOrders.forEach(order => {
        const currentOrder = undeliveredOrders.find(parsedOrder => parsedOrder.name === order.name && parsedOrder.price === order.price);

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

    const handleNamePaste = (event) => {
        const pastedValue = event.clipboardData.getData('text');
        if (pastedValue.length + customer.name.length > 50) {
          setNameBuffer(pastedValue);
          event.preventDefault();
        }
    }

    const handleNameChange = (event) => {
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
      
    const openMenu = () => {
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
                <Button type='destructive' clickEvent={() => {confirmDeleteCustomer(customer)}}>Delete</Button>
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




