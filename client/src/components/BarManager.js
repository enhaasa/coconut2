import CustomerManager from "./CustomerManager";

export default function BarManager(props) {

    const { 
        customers,  
        setSelectedCustomerManager 
    } = props;

    const customersInBar = customers.get.filter(c => c.table === null);

    return (
        <div className="BarManager">
            {
                customersInBar.map(customer => (
                    <button onClick={() => setSelectedCustomerManager(customer)}>{customer.name}</button>
                ))
            }
        </div>
    )
}