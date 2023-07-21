import Section from '../components/Section'
import SeatingManager from '../components/SeatingManager';
import CustomerManager from '../components/CustomerManager';
import MenuManager from '../components/MenuManager';
import ReceiptManager from '../components/ReceiptManager';
import NotificationBar from '../components/NotificationBar';
import uuid from 'react-uuid';
import React, { useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';

function SectionManager(props) {
    const {
      setSelectedSeating,
      setSelectedCustomer,
      setSelectedCustomerManager,
      setSelectedSection,
      selectedCustomer,
      selectedCustomerManager,
      selectedSeating,
      selectedSection,
      maxDeliveryTime,
    } = props;

    const { 
      sections, 
      seatings, 
      customers, 
      orders, 
      menu, 
      staff,
      dataTree
    } = useContext(DynamicDataContext);

    function getParsedSection() {
      return dataTree[selectedSection]
    }


    return(
        <div className="FloorManager">

        <section className="TableManagerContainer">
              {selectedSeating !== null &&
                <SeatingManager 
                  selectedSeating={selectedSeating} 
                  setSelectedSeating={setSelectedSeating}
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
                          seatings.get.length > 0 &&
                            <NotificationBar
                              customers={
                                customers.get.filter(customer => 
                                  customer.section === section.type && 
                                    !seatings.get.find(seating => seating.id === customer.seating
                                      && seating).isAvailable && customer)}

                              orders={orders.get.filter(order => order.section === section.type && !order.delivered && order)}
                          />
                        }

                        <button 
                          className={`floorButton ${selectedSeating === index ? "active" : "inactive"}`} 
                          key={index} 
                          onClick={() => {setSelectedSection(index)}}>
                          <span className="title cursive">{section.name}</span>
                        </button>
                      </div>
                  )
                })
              }
            </span>
          </nav>
          
          {sections.get[selectedSection] && 
          <Section 
            section={sections.get[selectedSection]} 
            parsedSection={getParsedSection()}
            maxDeliveryTime={maxDeliveryTime}
            setSelectedSeating={setSelectedSeating}
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

export default SectionManager;