import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

//Views
import Payouts from './views/Payouts';
import SectionManager from './views/SectionManager';

//Tools
import uuid from 'react-uuid';

//Hooks
import usePixelClick from './api/usePixelClick';

//BACKEND_PLACEHOLDER
import logo from './assets/icons/logo.png';
import { DynamicDataProvider } from './api/DynamicData';
import { ControlStatesProvider } from './api/ControlStates';

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
  const [ itemInMovement, setItemInMovement ] = useState(null);

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

  return (
    <>
      <div className="app-info">
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
            <ControlStatesProvider>
              <DynamicDataProvider 
                socket={socket} 
                selectedSeatingTracker={selectedSeatingTracker} 
                setSelectedCustomer={setSelectedCustomer}>
                  
                <SectionManager 
                  key={uuid()}
                  isBlurred={isBlurred}
                  loggedInAs={loggedInAs}
                />

                <Payouts 
                  setIsBlurred={setIsBlurred}
                />
              </DynamicDataProvider>
            </ControlStatesProvider>
      }
      </main>
    </>

  );
}

export default App;