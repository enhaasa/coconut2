import React, { useRef, useLayoutEffect} from 'react';
import uuid from 'react-uuid';
import tools from '../tools';
import removecustomerIcon from './../assets/icons/remove-user.png';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';
import gsap from 'gsap';
import animations from '../animations';

export function Customer(props) {
    const {
        unDeliveredOrderCustomersInTable,
        confirmDeleteCustomer,
        customer,
        handleCustomers,
        orders,
        handleOrders,
        openMenu,
    } = props;

    const customerRef = useRef();
    useLayoutEffect(() => {
        gsap.from(customerRef.current, animations.appearY);

        return () => {
            gsap.to(customerRef.current, animations.appearY);
        }
    }, []);

    return (
        <div className="customer" key={customer.id} ref={customerRef}>
            <nav className="nameNav">
                <input 
                    type="text" 
                    value={customer.name} 
                    placeholder="Enter name..." 
                    onChange={(e) => {handleCustomers.editName(customer.id, e.target.value)}}>
                </input>
                <button className="icon" onClick={() => {confirmDeleteCustomer(customer.id, customer.name)}}>
                    <img src={removecustomerIcon} alt="" />
                </button>
            </nav>

            <table key={uuid()} className="itemTable">
                {unDeliveredOrderCustomersInTable.includes(customer.id) &&
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
                    {tools.sortArrayByCustomer(orders, false).map(order => (  
                        order.customer === customer.id && 
                                
                            <tr key={order.id}>
                                <td>{order.name}</td>
                                <td>{order.price.toLocaleString("en-US")} gil</td>
                                <td>{order.amount}</td>
                                <td>{order.total.toLocaleString("en-US")} gil</td>

                                <td className="tableNav">
                                    <button className="icon" onClick={() => {handleOrders.remove(order.ids[order.ids.length -1])}}>
                                        <img src={minusIcon} alt="" />
                                    </button>
                                    <button className="icon" onClick={() => {handleOrders.add({...order, delivered: false})}}>
                                        <img src={plusIcon} alt="" />
                                    </button>
                                    <button className="text constructive" onClick={() => {handleOrders.deliver(order.ids[0])}}> Deliver </button>
                                </td>
                            </tr>
                                
                        ))}
                    </tbody>
            </table>
            <nav className="customerNav">
                <button className="text progressive" onClick={() => {openMenu(customer)}}>Add Order</button>
                {unDeliveredOrderCustomersInTable.includes(customer.id) && 
                    <button className="text constructive" onClick={() => {handleOrders.deliverAll(customer.id)}}>Deliver All</button>}
            </nav>       
        </div>
    );
}




