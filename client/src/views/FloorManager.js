import Floor from './../components/Floor'
import TableManager from './../components/TableManager';
import CustomerManager from '../components/CustomerManager';
import MenuManager from './../components/MenuManager';
import ReceiptManager from './../components/ReceiptManager';
import NotificationBar from './../components/NotificationBar';
import uuid from 'react-uuid';

function FloorManager(props) {
    const {
        staff,
        orders,
        tables,
        customers,
        setSelectedTable,
        setSelectedCustomer,
        setSelectedCustomerManager,
        setSelectedFloor,
        menu,
        selectedCustomer,
        selectedCustomerManager,
        selectedTable,
        selectedFloor,
        sections,
        maxDeliveryTime
    } = props;

    return(
        <div className="FloorManager">

        <section className="TableManagerContainer">
      
          
              {selectedTable !== null &&
                <TableManager 
                  staff={staff}
                  orders={orders}
                  tables={tables}
                  customers={customers}
                  table={tables.get[selectedTable]} 
                  setSelectedTable={setSelectedTable}
                  setSelectedCustomer={setSelectedCustomer}
                />
              }

              {selectedCustomerManager !== null &&
                <CustomerManager 
                  orders={orders}
                  customers={customers}
                  customer={selectedCustomerManager}
                  setSelectedCustomer={setSelectedCustomer}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomerManager={setSelectedCustomerManager}
                />
              }


              {selectedCustomer !== null &&
                <MenuManager 
                  menu={menu}
                  selectedCustomer={selectedCustomer}
                  orders={orders}
                  setSelectedCustomer={setSelectedCustomer}
                />
            }
     
        </section>
        
        <section className="FloorContainer">
          <nav className="floorNav">
            <span className="floorColumn">
              {sections.map((section, index) => {
                  return (
                      <div className="floorSelector" key={uuid()}>
                        {
                          customers.get.length > 0 &&
                          tables.get.length > 0 &&
                            <NotificationBar
                              customers={
                                customers.get.filter(customer => 
                                  customer.section === section.type && 
                                    !tables.get.find(table => table.id === customer.table 
                                      && table).isAvailable && customer)}

                              orders={orders.get.filter(order => order.section === section.type && !order.delivered && order)}
                          />
                        }

                        <button 
                          className={`floorButton ${selectedFloor === index ? "active" : "inactive"}`} 
                          key={index} 
                          onClick={() => {setSelectedFloor(index)}}>
                          <span className="title cursive">{section.name}</span>
                        </button>
                      </div>
                  )
                })
              }
            </span>


          </nav>
          
          {sections[selectedFloor] && <Floor 
            section={sections[selectedFloor]} 
            tables={tables} 
            maxDeliveryTime={maxDeliveryTime}
            setSelectedTable={setSelectedTable}
            setSelectedCustomer={setSelectedCustomer}
            setSelectedCustomerManager={setSelectedCustomerManager}
            orders={orders}
            customers={customers}
          />}
          
        </section>

        {/*
          <section className="ReceiptManagerContainer">
            <ReceiptManager 
              archivedOrders={archivedOrders}
            />
          </section>
          */
        }
      
      </div>
    )
}

export default FloorManager;