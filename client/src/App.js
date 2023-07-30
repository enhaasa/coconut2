import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

//Views
import Payouts from './views/Payouts';
import SectionManager from './views/SectionManager';
import TopNav from './components/TopNav';
import Main from './components/Main';

//Tools
import uuid from 'react-uuid';

//Contexts
import { DynamicDataProvider } from './api/DynamicData';
import { ControlStatesProvider } from './api/ControlStates';
import { StaticDataContextProvider } from './api/StaticData';

export default function App() {

  const [ socket, setSocket ] = useState(null);
  
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server!');
    });

  }, []);

  /**
   * Controlstates to know which windows to load.
   */
  const [ isBlurred, setIsBlurred ] = useState(false);
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);
  const [ selectedSeating, setSelectedSeating ] = useState(null);


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

        {socket && 
              <ControlStatesProvider>
                <StaticDataContextProvider>
                  <DynamicDataProvider 
                    socket={socket} 
                    selectedSeatingTracker={selectedSeatingTracker} 
                    setSelectedCustomer={setSelectedCustomer}>

                    <Main>
                      <TopNav />

                      <SectionManager 
                        key={uuid()}
                        isBlurred={isBlurred}
                      />

                      <Payouts 
                        setIsBlurred={setIsBlurred}
                      />

                    </Main>
                    
                  </DynamicDataProvider>
                </StaticDataContextProvider>
              </ControlStatesProvider>
        }

    </>

  );
}