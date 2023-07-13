import React, { useRef, useEffect, useLayoutEffect, useContext } from 'react';
import uuid from 'react-uuid';
import tools from '../tools';
import removecustomerIcon from './../assets/icons/remove-user.png';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';
import gsap from 'gsap';
import animations from '../animations';
import infoIcon from './../assets/icons/info.png';
import { DynamicDataContext } from '../api/DynamicData';

export default function Customer(props) {
    const {
        confirmDeleteCustomer,
        setSelectedCustomer,
        customer,
    } = props;

    const {
        customers,
        orders
    } = useContext(DynamicDataContext);


    const isInTable = customer.table !== null ? true : false;
    const undeliveredOrders = orders.get.filter(order => !order.is_delivered && order.customer_id === customer.id);

    let timer = useRef();

    const customerRef = useRef();
    useLayoutEffect(() => {
        gsap.from(customerRef.current, animations.appearY);

        return () => {
            gsap.to(customerRef.current, animations.appearY);
        }
    }, []);

    const handleNamePaste = (event) => {
        const pastedValue = event.clipboardData.getData("text");
        if (pastedValue.length + customer.name.length > 50) {
          event.preventDefault();
        }
    };

    const handleNameChange = (event) => {
        const { value } = event.target;
        if (value.length <= 50) {
            customers.editName(customer.uuid, event.target.value, false);
        
            if (timer.current) {
                clearTimeout(timer.current);
            }

            timer.current = setTimeout(() => {

                customers.editName(customer.uuid, customer.name);
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
                    value={customer.name} 
                    placeholder="Enter name..." 
                    maxLength={50}
                    onPaste={handleNamePaste}
                    onChange={handleNameChange}>
                </input>

                {isInTable &&
                <button className="icon" onClick={() => {confirmDeleteCustomer(customer)}}>
                    <img src={removecustomerIcon} alt="" />
                </button>
                }
            </nav>

            <table key={uuid()} className="itemTable">
                {undeliveredOrders.length > 0 &&
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
                    {tools.sortArrayByCustomer(orders.get, false).map(order => (  
                        order.customer_id === customer.id && 
                                
                            <tr key={order.uuid}>
                                <td>{order.name}</td>
                                <td>{order.price.toLocaleString("en-US")} gil</td>
                                <td>{order.amount}</td>
                                <td>{order.total.toLocaleString("en-US")} gil</td>
                                <td className="tableNav">
                                    <button className="icon tooltip">
                                        <img src={infoIcon} alt="" className="tooltip" />

                                        <span className="tooltiptext">
                                            {order.item}
                                        </span>
                                    </button>
                                </td>

                                <td className="tableNav end">
                                    <button className="icon" onClick={() => {orders.remove(order.ids[order.ids.length -1])}}>
                                        <img src={minusIcon} alt="" />
                                    </button>
                                    <button className="icon" onClick={() => {orders.add({...order, delivered: false, customer_id: customer.id})}}>
                                        <img src={plusIcon} alt="" />
                                    </button>
                                    <button className="text constructive" onClick={() => {orders.deliver(order.ids[0])}}>Deliver </button>
                                </td>
                            </tr>
                                
                        ))}
                    </tbody>
            </table>
            <nav className="customerNav">
                <button className="text progressive" onClick={() => {openMenu(customer)}}>Add Order</button>

                {undeliveredOrders.length > 0 &&
                    <button className="text constructive" onClick={() => {orders.deliverAll(customer.id)}}>Deliver All</button>}
            </nav>       
        </div>
    );
}




