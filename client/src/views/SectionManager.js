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
        <div className="SectionManager">

        <section className="SeatingManagerContainer">
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
        
        <section className="SectionContainer">
          <nav className="section-nav">
            <span className="section-column">
              {sections.get.map((section, index) => {
                  return (
                      <div className="section-selector" key={uuid()}>
                        {
                          customers.get.length > 0 &&
                          seatings.get.length > 0 &&
                            <NotificationBar
                              customers={
                                customers.get.filter(customer => 
                                  customer.section_id === section.id && 
                                    !seatings.get.find(seating => seating.id === customer.seating_id
                                      && seating).isAvailable && customer)}

                              orders={orders.get.filter(order => order.section_id === section.id && !order.is_delivered && order)}
                          />
                        }

                        <button 
                          className={`section-button ${selectedSection === index ? "active" : "inactive"}`} 
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
      
      </div>
    )
}

export default SectionManager;