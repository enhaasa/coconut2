import React from 'react';
import uuid from 'react-uuid';
import tools from '../tools';

//import trashcanIcon from './../assets/icons/trash-can-black.png';
import removecustomerIcon from './../assets/icons/remove-user.png';
import addcustomerIcon from './../assets/icons/add-user-black.png';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';

export function OrderManager(props) {

    function openMenu(customer) {
        props.setSelectedCustomer(customer);
    }

    function confirmDeleteCustomer(id, customerName) {

        const checkedCustomerName = customerName !== "" ? customerName : "the customer";
        props.openConfirmBox({
            callback: function(){
                props.removeCustomer(id);
                props.closeConfirmBox();
            },
            closeConfirmBox: function(){props.closeConfirmBox()},
            title: "Are you sure?",
            message: `Deleting ${checkedCustomerName} will also delete any unpaid orders.`
        })
    }

    let unDeliveredOrderCustomersInTable = props.unDeliveredOrdersInTable ? 
    props.unDeliveredOrdersInTable.map(order => order.customer) : [];

    return (
        <>
            <section className="OrderManager">
                <div className="customerContainer">
                    {props.customers.map(customer => (
                    
                        props.table.id === customer.table && 
                            <div className="customer" key={customer.id}>

                                <nav className="nameNav">
                                    <input 
                                        type="text" 
                                        value={customer.name} 
                                        placeholder="Enter name..." 
                                        onChange={(e) => {props.editCustomerName(customer.id, e.target.value)}}>
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
                                    {tools.sortArrayByCustomer(props.orders, false).map(order => (  
                                        order.customer === customer.id && 
                                                
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
                                    <button className="text progressive" onClick={() => {openMenu(customer)}}>Add Order</button>
                                    {unDeliveredOrderCustomersInTable.includes(customer.id) && 
                                        <button className="text constructive" onClick={() => {props.deliverAll(customer.id)}}>Deliver All</button>}
                                </nav>       

                            </div>
                       ))} 
                </div>
                

                <nav className="ordersNav">
                    <button className="icon" onClick={() => {props.addCustomer(props.table)}}>
                        <img src={addcustomerIcon} alt="" />
                    </button>
                </nav>
            </section>
        </>
    );
}