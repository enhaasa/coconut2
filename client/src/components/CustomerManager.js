import closeIcon from './../assets/icons/close.png';
import resetIcon from './../assets/icons/reset-black.png';
import trashcanIcon from './../assets/icons/trash-can-black.png';
import Customer from './Customer';

export default function CustomerManager(props) {

    const {
        orders,
        selectedCustomer,
        customer,
        customers,
        setSelectedCustomerManager,
        setSelectedCustomer
    } = props;

    return (
        <div className="CustomerManager">

            <div className="header">
                <span className="customerName">{customer.name}</span>

                <button className="closeButton" onClick={() => setSelectedCustomerManager(null)}>
                    <img src={closeIcon} alt="" />
                </button>
            </div>

            <section className="OrderManager">
                <div className="customerContainer">
                    <Customer
                        orders={orders}
                        customers={customers}
                        customer={customer}
                        setSelectedCustomer={setSelectedCustomer}
                    
                    />
                </div>
            </section>

        {false &&
            <button onClick={() => {console.log(customers.remove(customer.id))}} className="resetButton destructive">
                <img src={trashcanIcon} /> Delete Customer
            </button>}

        </div>
    )
}