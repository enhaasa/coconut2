import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

//Hooks
import useCustomers from './hooks/useCustomers';
import useOrders from './hooks/useOrders';
import useMenu from './hooks/useMenu';
import useStaff from './hooks/useStaff';
import useArchivedOrders from './hooks/useArchivedOrders';
import useArchivedSessions from './hooks/useArchivedSessions';
import useTables from './hooks/useTables';
import useTips from './hooks/useTips';
import useSections from './hooks/useSections';

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

  const selectedCustomerManagerTracker = useRef(null);
  useEffect(() => {
    selectedCustomerManagerTracker.current = selectedCustomerManager;
    selectedCustomerManager !== null ?
    setIsBlurred(true) :
    setIsBlurred(false);
    setSelectedCustomer(null);
  }, [selectedCustomerManager]);


  //BACKEND_PLACEHOLDER
  /*
  const floors = [
    {
      title: "Basement",
      name: "basement",
      type: "restaurant",
      schematics: basement
    },
    {
      title: "Ground Floor",
      name: "ground",
      type: "restaurant",
      schematics: ground
    },
    {
      title: "Bar",
      name: "bar-1",
      type: "bar",
      schematics: bar
    }
  ];
  */


  /**
   * Custom Hooks
   */

    const [ archivedOrders ] = useArchivedOrders([]);
    const [ archivedSessions ] = useArchivedSessions([]);

    const [ sections ] = useSections([], {
      socket: socket
    })

    const [ tables ] = useTables([], {
      selectedTableTracker: selectedTableTracker, 
      socket: socket
    });

    const [ orders ] = useOrders([], {
      archivedOrders: archivedOrders,
      archivedSessions: archivedSessions,
      socket: socket
    });

    const [ customers ] = useCustomers([], {
      setSelectedCustomer,
      orders: orders,
      socket: socket
    });

    const [ tips ] = useTips([]);
    const [ menu ] = useMenu([], {selectedTable});
    const [ staff ] = useStaff([]);

  /**
   * Initiate and set short-polling interval
   */
  const pollingInterval = 2000; //Time in milliseconds
  useEffect(() => {
    //Initial updates when app is first loaded
    if (socket) {
      menu.refresh();
      tables.refresh();
      staff.refresh();
      customers.refresh();
      orders.refresh();
      archivedSessions.refresh();
      archivedOrders.refresh();
      tips.refresh();
      sections.refresh();
    }
  }, [socket]);

  const views = [
    {
      title: "Floor Manager",
      content: 
      <FloorManager 
        staff={staff}
        orders={orders}
        tables={tables}
        customers={customers}
        setSelectedTable={setSelectedTable}
        setSelectedCustomerManager={setSelectedCustomerManager}
        selectedCustomerManager={selectedCustomerManager}
        setSelectedCustomer={setSelectedCustomer}
        setSelectedFloor={setSelectedFloor}
        menu={menu}
        selectedCustomer={selectedCustomer}
        isBlurred={isBlurred}
        loggedInAs={loggedInAs}
        selectedTable={selectedTable}
        selectedFloor={selectedFloor}
        sections={sections.get}
        maxDeliveryTime={maxDeliveryTime}
      />
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
    */
  ]

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
        <button onClick={() => {console.log(tables.get)}}>Test Tables</button>
      {isBlurred === true &&
          <div className="blur" />
          }
      {socket ? views.map((v, i) => (
          v.content
        )) : "Loading"}
      </main>
    </>

  );
}

export default App;