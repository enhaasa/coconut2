import Floor from './../components/Floor'
import TableManager from './../components/TableManager';
import CustomerManager from '../components/CustomerManager';
import MenuManager from './../components/MenuManager';
import ReceiptManager from './../components/ReceiptManager';
import NotificationBar from './../components/NotificationBar';
import uuid from 'react-uuid';
import React, { useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';

function FloorManager(props) {
    const {
      setSelectedTable,
      setSelectedCustomer,
      setSelectedCustomerManager,
      setSelectedFloor,
      selectedCustomer,
      selectedCustomerManager,
      selectedTable,
      selectedFloor,
      maxDeliveryTime,
    } = props;

    const { 
      sections, 
      tables, 
      customers, 
      orders, 
      menu, 
      staff,
      dataTree
    } = useContext(DynamicDataContext);

    function getFloor() {
      return dataTree[selectedFloor]
    }


    return(
        <div className="FloorManager">

        <section className="TableManagerContainer">
              {selectedTable !== null &&
                <TableManager 
                  selectedTable={selectedTable} 
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
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                />
            }
     
        </section>
        
        <section className="FloorContainer">
          <nav className="floorNav">
            <span className="floorColumn">
              {sections.get.map((section, index) => {
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
          
          {sections.get[selectedFloor] && 
          <Floor 
            section={sections.get[selectedFloor]} 
            floor={getFloor()}
            maxDeliveryTime={maxDeliveryTime}
            setSelectedTable={setSelectedTable}
            setSelectedCustomer={setSelectedCustomer}
            setSelectedCustomerManager={setSelectedCustomerManager}
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