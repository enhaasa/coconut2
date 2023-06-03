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
        isBlurred,
        loggedInAs,
        selectedTable,
        selectedFloor,
        floors,
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
              {floors.map((floor, index) => {
                  return (
                      <div className="floorSelector" key={uuid()}>
                        {
                          customers.get.length > 0 &&
                          tables.get.length > 0 &&
                            <NotificationBar
                              customers={
                                customers.get.filter(customer => 
                                  customer.floor === floor.type && 
                                    !tables.get.find(table => table.id === customer.table 
                                      && table).isAvailable && customer)}

                              orders={orders.get.filter(order => order.floor === floor.type && !order.delivered && order)}
                          />
                        }

                        <button 
                          className={`floorButton ${selectedFloor === index ? "active" : "inactive"}`} 
                          key={index} 
                          onClick={() => {setSelectedFloor(index)}}>
                          <span className="title cursive">{floor.title}</span>
                        </button>
                      </div>
                  )
                })
              }
            </span>


          </nav>
            
          <Floor 
            loggedInAs={loggedInAs}
            floor={floors[selectedFloor]} 
            tables={tables} 
            maxDeliveryTime={maxDeliveryTime}
            setSelectedTable={setSelectedTable}
            setSelectedCustomer={setSelectedCustomer}
            setSelectedCustomerManager={setSelectedCustomerManager}
            orders={orders}
            customers={customers}
          />
          
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