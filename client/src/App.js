import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

//Hooks
import useMenu from './api/hooks/useMenu';
import useStaff from './api/hooks/useStaff';

//Views
import Payouts from './views/Payouts';
import SectionManager from './views/SectionManager';

//Components
import ReceiptManager from './components/ReceiptManager';

//Tools
import uuid from 'react-uuid';

//BACKEND_PLACEHOLDER
import ground from './assets/schematics/ground.webp';
import basement from './assets/schematics/basement.webp';
import bar from './assets/schematics/bar-1.webp';
import logo from './assets/icons/logo.png';
import { DynamicDataProvider } from './api/DynamicData';

function App() {

  const [ socket, setSocket ] = useState(null);
  
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server!');
    });

  }, []);

  const loggedInAs = "Coco Shev'rin"; //BACKEND_PLACEHOLDER
  const maxDeliveryTime = 600000; //Epoch time format; 1000 = one second

  /**
   * Controlstates to know which windows to load.
   */
  const [ isBlurred, setIsBlurred ] = useState(false);
  const [ selectedSection, setSelectedSection ] = useState(1);
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);
  const [ selectedSeating, setSelectedSeating ] = useState(null);
  const [ selectedCustomerManager, setSelectedCustomerManager ] = useState(null);

  /**
   * Temporary solution to useEffect not having access to updated values in component state
  */
  const selectedSeatingTracker = useRef(null);  
  useEffect(() => {
    selectedSeatingTracker.current = selectedSeating;
    selectedSeating !== null ?
    setIsBlurred(true) :
    setIsBlurred(false);
    setSelectedCustomer(null);
  }, [selectedSeating]);

  /*
  const selectedCustomerManagerTracker = useRef(null);
  useEffect(() => {
    selectedCustomerManagerTracker.current = selectedCustomerManager;
    selectedCustomerManager !== null ?
    setIsBlurred(true) :
    setIsBlurred(false);
    setSelectedCustomer(null);
  }, [selectedCustomerManager]);
  */



  return (
    <>
      <div className="appInfo">
        <span className="logo">
          <img src={logo} alt="" />
        </span>
    
        <span className="text">
          <span className="title cursive">Coconut</span>
          <span className="version">by Enhasa</span>
        </span>
      </div>

      
      <main>

      {isBlurred === true &&
          <div className="blur" />
          }
      {socket && 
            <DynamicDataProvider 
              socket={socket} 
              selectedSeatingTracker={selectedSeatingTracker} 
              setSelectedCustomer={setSelectedCustomer}>
              <SectionManager 
                key={uuid()}
                setSelectedSeating={setSelectedSeating}
                setSelectedCustomerManager={setSelectedCustomerManager}
                selectedCustomerManager={selectedCustomerManager}
                setSelectedCustomer={setSelectedCustomer}
                setSelectedSection={setSelectedSection}
                selectedCustomer={selectedCustomer}
                isBlurred={isBlurred}
                loggedInAs={loggedInAs}
                selectedSeating={selectedSeating}
                selectedSection={selectedSection}
                maxDeliveryTime={maxDeliveryTime}
              />

              <Payouts 
                setIsBlurred={setIsBlurred}
              />
            </DynamicDataProvider>
      
      
      }
      </main>
    </>

  );
}

export default App;