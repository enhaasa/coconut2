import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

//Hooks
import useMenu from './api/hooks/useMenu';
import useStaff from './api/hooks/useStaff';

//Views
import Payouts from './views/Payouts';
import FloorManager from './views/FloorManager';

//Components
import ReceiptManager from './components/ReceiptManager';

//Tools
import uuid from 'react-uuid';
import db from './dbTools_client';

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
  const [ selectedFloor, setSelectedFloor ] = useState(1);
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);
  const [ selectedTable, setSelectedTable ] = useState(null);
  const [ selectedCustomerManager, setSelectedCustomerManager ] = useState(null);

  /**
   * Temporary solution to useEffect not having access to updated values in component state
  */
  const selectedTableTracker = useRef(null);  
  useEffect(() => {
    selectedTableTracker.current = selectedTable;
    selectedTable !== null ?
    setIsBlurred(true) :
    setIsBlurred(false);
    setSelectedCustomer(null);
  }, [selectedTable]);

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


  const views = [
    {
      title: "Floor Manager",
      content: 
      <DynamicDataProvider 
        socket={socket} 
        selectedTableTracker={selectedTableTracker} 
        setSelectedCustomer={setSelectedCustomer}>
        <FloorManager 
          key={uuid()}
          setSelectedTable={setSelectedTable}
          setSelectedCustomerManager={setSelectedCustomerManager}
          selectedCustomerManager={selectedCustomerManager}
          setSelectedCustomer={setSelectedCustomer}
          setSelectedFloor={setSelectedFloor}
          selectedCustomer={selectedCustomer}
          isBlurred={isBlurred}
          loggedInAs={loggedInAs}
          selectedTable={selectedTable}
          selectedFloor={selectedFloor}
          maxDeliveryTime={maxDeliveryTime}
        />
      </DynamicDataProvider>
    },
    /*
    {
      title: "Payouts",
      content:  
      <Payouts 
        staff={staff} 
        sections.get={floors}
        archivedOrders={archivedOrders}
        setIsBlurred={setIsBlurred}
        archivedSessions={archivedSessions}
        tips={tips}
      />
    }
    
  */  ]


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
              selectedTableTracker={selectedTableTracker} 
              setSelectedCustomer={setSelectedCustomer}>
              <FloorManager 
                key={uuid()}
                setSelectedTable={setSelectedTable}
                setSelectedCustomerManager={setSelectedCustomerManager}
                selectedCustomerManager={selectedCustomerManager}
                setSelectedCustomer={setSelectedCustomer}
                setSelectedFloor={setSelectedFloor}
                selectedCustomer={selectedCustomer}
                isBlurred={isBlurred}
                loggedInAs={loggedInAs}
                selectedTable={selectedTable}
                selectedFloor={selectedFloor}
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