import React, { useRef, useLayoutEffect, useContext, useState } from 'react';

//Components
import Order from './Order';
import Button from './common/Button/Button';
import Table from './common/Table/Table';

//Tools
import uuid from 'react-uuid';

//Contexts
import { DynamicDataContext } from '../api/DynamicData';
import { ControlStatesContext } from '../api/ControlStates';

//Animations
import gsap from 'gsap';
import animations from '../animations';

export default function Customer(props) {
    const {
        confirmDeleteCustomer,
        customer,
    } = props;

    const {
        customers,
        orders,
    } = useContext(DynamicDataContext);

    const {
        setSelectedCustomer,
        selectedCustomer
    } = useContext(ControlStatesContext);

    const [ nameBuffer, setNameBuffer ] = useState(customer.name);

    const isInSeating = customer.seating !== null ? true : false;
    
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
    const customerRef = useRef();

    /*
    useLayoutEffect(() => {
        gsap.from(customerRef.current, animations.appearY);

        return () => {
            gsap.to(customerRef.current, animations.appearY);
        }
    }, []);
    */

    function handleDeliverAllOrdersByCustomer(customer) {
        orders.deliverAllByCustomer(customer);
    }

    const handleNamePaste = (event) => {
        
        const pastedValue = event.clipboardData.getData('text');
        if (pastedValue.length + customer.name.length > 50) {
          setNameBuffer(pastedValue);
          event.preventDefault();
        }
        
    };

    const handleNameChange = (event) => {
        const { value } = event.target;
        if (value.length <= 50) {
          setNameBuffer(value);
      
          if (timer.current) {
            clearTimeout(timer.current);
          }
      
          const currentNameBuffer = value; 
      
          timer.current = setTimeout(() => {
            customers.editName(customer.uuid, currentNameBuffer); 
          }, 500);
        }
    };
      
    const openMenu = () => {
        setSelectedCustomer(customer);
    }

    return (
        <div className={`Customer${selectedCustomer && selectedCustomer.id === customer.id ? ' active' : ''}`} 
            key={customer.uuid} 
            ref={customerRef}>
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

                {isInSeating &&
                <Button type='destructive' clickEvent={() => {confirmDeleteCustomer(customer)}}>Delete</Button>

                }
            </nav>

            {customer.undeliveredOrders.length > 0 &&
                <div className='orders'>
                    <Table>
                        {undeliveredOrders.map(order => (
                            <Order 
                                key={uuid()}
                                order={order} 
                            />
                        ))}
                    </Table>
                </div>
            }

            <nav className='customer-nav'>
                <Button type='constructive' clickEvent={() => {openMenu(customer)}}>Add Order</Button>

                {
                    customer.undeliveredOrders.length > 0 &&
                        <Button type='neutral' clickEvent={() => {handleDeliverAllOrdersByCustomer(customer)}}>Deliver All</Button>
                }
            </nav>       
        </div>
    );
}




