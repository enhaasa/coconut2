import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

//Views
import Payouts from './views/Payouts/Payouts';
import SectionManager from './views/SectionManager/SectionManager';
import TopNav from './components/TopNav/TopNav';
import Main from './components/Main';
import Footer from './components/Footer/Footer';

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

  return (
    <>
        {socket && 
              <ControlStatesProvider>
                <StaticDataContextProvider>
                  <DynamicDataProvider socket={socket} >
                    
                    <Main>
                      <TopNav />
                      <SectionManager />
                      <Payouts />
                      <Footer />
                    </Main>
                    
                  </DynamicDataProvider>
                </StaticDataContextProvider>
              </ControlStatesProvider>
        }
    </>
  );
}