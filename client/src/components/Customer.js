import React, { useRef, useEffect, useLayoutEffect} from 'react';
import uuid from 'react-uuid';
import tools from '../tools';
import removecustomerIcon from './../assets/icons/remove-user.png';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';
import gsap from 'gsap';
import animations from '../animations';
import infoIcon from './../assets/icons/info.png';


export default function Customer(props) {
    const {
        unDeliveredOrderCustomersInTable,
        confirmDeleteCustomer,
        customer,
        customers,
        orders,
        openMenu,
    } = props;

    let timer = useRef();
    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            customers.editName(customer.id, customer.name, true);
        }, 500)
    }, [customer.name]);


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
        if (value.length <= 35) {
            customers.editName(customer.id, event.target.value, false);
        }
    };
      

    return (
        <div className="customer" key={customer.id} ref={customerRef}>
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
                            <th>Item</th>
                            <th></th>
                        </tr>
                    </thead>}

                    <tbody>
                    {tools.sortArrayByCustomer(orders.get, false).map(order => (  
                        order.customer === customer.id && 
                                
                            <tr key={order.id}>
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
                                    <button className="icon" onClick={() => {orders.add({...order, delivered: false})}}>
                                        <img src={plusIcon} alt="" />
                                    </button>
                                    <button className="text constructive" onClick={() => {orders.deliver(order.ids[0])}}> Deliver </button>
                                </td>
                            </tr>
                                
                        ))}
                    </tbody>
            </table>
            <nav className="customerNav">
                <button className="text progressive" onClick={() => {openMenu(customer)}}>Add Order</button>
                {unDeliveredOrderCustomersInTable.includes(customer.id) && 
                    <button className="text constructive" onClick={() => {orders.deliverAll(customer.id)}}>Deliver All</button>}
            </nav>       
        </div>
    );
}




