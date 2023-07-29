import Section from '../components/Section';
import SeatingManager from '../components/SeatingManager';
import MenuManager from '../components/MenuManager';
import NotificationBar from '../components/NotificationBar';
import uuid from 'react-uuid';
import React, { useContext, useState } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import { ControlStatesContext } from '../api/ControlStates';

function SectionManager(props) {

  const {
    isBlurred,
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

  const {
    setSelectedSection,
    selectedCustomer,
    selectedSeating,
    selectedSection,
  } = useContext(ControlStatesContext);

  function getParsedSection() {
    return dataTree[selectedSection]
  }

  return(
    <div className='SectionManager'>

      <section className='SeatingManagerContainer'>
        {selectedSeating !== null &&
          <SeatingManager />
        }

        {selectedCustomer !== null &&
          <MenuManager />
        }
      </section>
      
      <section className='SectionContainer'>
        <nav className='section-nav'>
          <span className='section-column'>
            {/*
            sections.get.map((section, index) => {
                return (
                    <div className='section-selector' key={uuid()}>
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
                        className={`section-button ${selectedSection === index ? 'active' : 'inactive'}`} 
                        key={index} 
                        onClick={() => {setSelectedSection(index)}}>
                        <span className='title'>{section.name}</span>
                      </button>
                    </div>
                )
              })
            */}
          </span>
        </nav>
        
        {sections.get[selectedSection] && 
        <Section 
          section={sections.get[selectedSection]} 
          parsedSection={getParsedSection()}
        />}
        
      </section>
    
    </div>
  )
}

export default SectionManager;