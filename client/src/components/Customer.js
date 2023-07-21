import React, { useRef, useLayoutEffect, useContext, useEffect } from 'react';
import uuid from 'react-uuid';
import removecustomerIcon from './../assets/icons/remove-user.png';
import gsap from 'gsap';
import animations from '../animations';
import { DynamicDataContext } from '../api/DynamicData';
import { useState } from 'react';
import Order from './Order';

export default function Customer(props) {
    const {
        confirmDeleteCustomer,
        setSelectedCustomer,
        customer,
    } = props;

    const {
        customers,
        orders,
    } = useContext(DynamicDataContext);

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
    useLayoutEffect(() => {
        gsap.from(customerRef.current, animations.appearY);

        return () => {
            gsap.to(customerRef.current, animations.appearY);
        }
    }, []);

    function handleDeliverAllOrdersByCustomer(customer) {
        orders.deliverAllByCustomer(customer);
    }

    const handleNamePaste = (event) => {
        
        const pastedValue = event.clipboardData.getData("text");
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
        <div className="customer" key={customer.uuid} ref={customerRef}>
            <nav className="nameNav">
                <input 
                    spellCheck={false}
                    type="text" 
                    value={nameBuffer} 
                    placeholder="Enter name..." 
                    maxLength={50}
                    onPaste={handleNamePaste}
                    onChange={handleNameChange}>
                </input>

                {isInSeating &&
                <button className="icon" onClick={() => {confirmDeleteCustomer(customer)}}>
                    <img src={removecustomerIcon} alt="" />
                </button>
                }
            </nav>

            <table key={uuid()} className="itemTable">
                {customer.undeliveredOrders.length > 0 &&
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Total</th>
                            <th>Item</th>
                            <th></th>
                        </tr>
                    </thead>}

                    <tbody>
                    {customer.undeliveredOrders.length > 0 && 
                        undeliveredOrders.map(order => (  
                            <Order 
                                key={uuid()}
                                order={order} 
                            />
                        ))}
                    </tbody>
            </table>
            <nav className="customerNav">
                <button className="text progressive" onClick={() => {openMenu(customer)}}>Add Order</button>

                {customer.undeliveredOrders.length > 0 &&
                    <button className="text constructive" onClick={() => {handleDeliverAllOrdersByCustomer(customer)}}>Deliver All</button>}
            </nav>       
        </div>
    );
}




