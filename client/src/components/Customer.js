import React, { useRef, useLayoutEffect} from 'react';
import uuid from 'react-uuid';
import tools from '../tools';
import removecustomerIcon from './../assets/icons/remove-user.png';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';
import gsap from 'gsap';
import animations from '../animations';

export function Customer(props) {

    const customerRef = useRef();
    useLayoutEffect(() => {
        gsap.from(customerRef.current, animations.appearY);

        return () => {
            gsap.to(customerRef.current, animations.appearY);
        }
    }, []);

    return (
        <div className="customer" key={props.customer.id} ref={customerRef}>
            <nav className="nameNav">
                <input 
                    type="text" 
                    value={props.customer.name} 
                    placeholder="Enter name..." 
                    onChange={(e) => {props.editCustomerName(props.customer.id, e.target.value)}}>
                </input>
                <button className="icon" onClick={() => {props.confirmDeleteCustomer(props.customer.id, props.customer.name)}}>
                    <img src={removecustomerIcon} alt="" />
                </button>
            </nav>

            <table key={uuid()} className="itemTable">
                {props.unDeliveredOrderCustomersInTable.includes(props.customer.id) &&
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>}

                    <tbody>
                    {tools.sortArrayByCustomer(props.orders, false).map(order => (  
                        order.customer === props.customer.id && 
                                
                            <tr key={order.id}>
                                <td>{order.name}</td>
                                <td>{order.price.toLocaleString("en-US")} gil</td>
                                <td>{order.amount}</td>
                                <td>{order.total.toLocaleString("en-US")} gil</td>

                                <td className="tableNav">
                                    <button className="icon" onClick={() => {props.removeOrder(order.ids[order.ids.length -1])}}>
                                        <img src={minusIcon} alt="" />
                                    </button>
                                    <button className="icon" onClick={() => {props.addOrder({...order, delivered: false})}}>
                                        <img src={plusIcon} alt="" />
                                    </button>
                                    <button className="text constructive" onClick={() => {props.deliverOrder(order.ids[0])}}> Deliver </button>
                                </td>
                            </tr>
                                
                        ))}
                    </tbody>
            </table>
            <nav className="customerNav">
                <button className="text progressive" onClick={() => {props.openMenu(props.customer)}}>Add Order</button>
                {props.unDeliveredOrderCustomersInTable.includes(props.customer.id) && 
                    <button className="text constructive" onClick={() => {props.deliverAll(props.customer.id)}}>Deliver All</button>}
            </nav>       
        </div>
    );
}




