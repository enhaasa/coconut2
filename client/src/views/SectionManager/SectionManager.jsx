import React, { useState, useContext } from 'react';

//Components
import Section from '../../components/Section/Section';
import SeatingManager from '../../components/SeatingManager/SeatingManager';
import MenuManager from '../../components/MenuManager/MenuManager';
import NotificationBar from './../../components/common/NotificationBar/NotificationBar';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';

function SectionManager() {

  const { 
    sections, 
  } = useContext(DynamicDataContext);

  const {
    selectedCustomer,
    selectedSeating,
    selectedSection,
  } = useContext(ControlStatesContext);

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
        {sections.get[selectedSection] && <Section />}
      </section>
    
    </div>
  )
}

export default SectionManager;