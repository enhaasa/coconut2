import React, { useContext } from 'react';

//Components
import Section from '../components/Section';
import SeatingManager from '../components/SeatingManager';
import MenuManager from '../components/MenuManager';
import NotificationBar from '../components/NotificationBar';

//Contexts
import { DynamicDataContext } from '../api/DynamicData';
import { ControlStatesContext } from '../api/ControlStates';

function SectionManager(props) {

  const {
    isBlurred,
  } = props;

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