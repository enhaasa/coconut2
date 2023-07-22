import CustomerManager from "./CustomerManager";
import customerIcon from './../assets/icons/mediumuser-black.png';
import addcustomerIcon from './../assets/icons/add-user-white.png';
import tools from "../tools";


export default function BarManager(props) {

    const { getFirstName, getLastNames } = tools;

    function handleAdd() {
        customers.add({section: section.name, seating: null});
        //setSelectedCustomerManager(customers.get[customers.get.length]);
    }

    const { 
        orders,
        section,
        customers,  
        setSelectedCustomerManager 
    } = props;

    function getOrdersByCustomer(customer) {
        let delivered = [];
        let undelivered= [];

        orders.get.forEach(order => {
            if (order.customer !== customer.id) return;
            order.delivered ? delivered.push(order) : undelivered.push(order)
        });

        return {
            all: delivered + undelivered, 
            delivered: delivered, 
            undelivered: undelivered
        };
    }


    return (
        <div className="BarManager">

            <div className="customer-list">

            {customers.get.filter(c => c.section === section.name).map(customer => {
                    const amount = getOrdersByCustomer(customer).undelivered.length;

                    return <span className="customer-container" key={customer.id}>
                        <div className="notification-container">
                            {amount > 0 && 
                            <div className={`notification progressive`}>
                                {amount}
                            </div>}

                            {/* <div className="addendum">
                                <img src={stopwatchIcon} />
                                {formatTime(timeSinceLastOrder)}
                            </div>*/}
                        </div>

                        <button 
                            onClick={() => setSelectedCustomerManager(customer)}
                            className="button"
                        ><img src={customerIcon} />
                        </button>

                        {customer.name !== "" && <div className="name">
                            {`${getFirstName(customer.name)} ${getLastNames(customer.name).join("").charAt(0)}`}
                        </div>}
                    </span>

                })
                }
            </div>

            <div className="add-customer-button-container">
                <button className="add-customer-button" onClick={() => handleAdd()}>
                    <img src={addcustomerIcon} />
                </button>
            </div>
        </div>
    )
}