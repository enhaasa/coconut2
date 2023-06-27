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

  /*
  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('Connected to the server!');
    });
  }, []);
  */

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

  const updateUpdates = (table) => {
    const newUpdateId = uuid();
    tablesToUpdate.find(t => t.name === table).id.current = newUpdateId;

    db.updates.put('id', newUpdateId, 'name', table);
    //console.log("Updated " + table + " with the ID " + newUpdateId);
  }

  //BACKEND_PLACEHOLDER
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


  /**
   * Custom Hooks
   */
  const [ archivedOrders ] = useArchivedOrders([], {updateUpdates});
  const [ archivedSessions ] = useArchivedSessions([], {updateUpdates});

  const [ tables ] = useTables([], {
    selectedTableTracker: selectedTableTracker,
    updateUpdates: updateUpdates
  });

  const [ orders ] = useOrders([], {
    updateUpdates: updateUpdates,
    archivedOrders: archivedOrders,
    archivedSessions: archivedSessions
  });

  const [ customers ] = useCustomers([], {
    updateUpdates: updateUpdates, 
    setSelectedCustomer,
    orders: orders
  });

  const [ tips ] = useTips([], {
    updateUpdates: updateUpdates
  });

  const [ menu ] = useMenu([], {selectedTable});
  const [ staff ] = useStaff([], {
    updateUpdates: updateUpdates
  });

  /**
   * List of SQL tables to update.
   */
  const tablesToUpdate = [
  {
    name: "tables",
    id: useRef(null),
    refresh: tables.refresh
  },{
    name: "staff",
    id: useRef(null),
    refresh: staff.refresh
  },{
    name: "customers",
    id: useRef(null),
    refresh: customers.refresh
  },{
    name: "orders",
    id: useRef(null),
    refresh: orders.refresh
  },{
    name: "tips",
    id: useRef(null),
    refresh: tips.refresh
  },{
    name: "archived_orders",
    id: useRef(null),
    refresh: archivedOrders.refresh
  },{
    name: "archived_sessions",
    id: useRef(null),
    refresh: archivedSessions.refresh
  }];

  /**
   * Requests a list of all update ID's from the server, then checks if they match the ID's on the client.
   * If it doesn't match then it will grab a fresh copy of the corresponding SQL table and update the state
   * of the relevant array with the new data. 
   * 
   * This will prevent needless refreshing and expensive traffic.
   */
  const checkUpdates = () => {
    if (selectedTableTracker.current !== null) return; //Do not update when a table is open
    if (selectedCustomerManagerTracker.current !== null) return;

    db.updates.get().then(res => {
      tablesToUpdate.forEach(table => {
        const currentId = res.find(obj => obj.name === table.name).id;

        if (table.id.current !== currentId) {
          //console.log("Grabbing fresh copy of " + table.name)
          table.refresh();
          table.id.current = currentId;
        }
      })
    })
  }

  /**
   * Initiate and set short-polling interval
   */
  const pollingInterval = 2000; //Time in milliseconds
  useEffect(() => {
    //Initial updates when app is first loaded
    menu.refresh();
    tables.refresh();
    staff.refresh();
    customers.refresh();
    orders.refresh();
    archivedSessions.refresh();
    archivedOrders.refresh();
    tips.refresh();

    //Start short polling
    setInterval(() => {
      checkUpdates();
    }, pollingInterval);

  }, []);

  const [ view, setView ] = useState(0);
  const views = [
    {
      title: "Floor Manager",
      content: 
      <FloorManager 
        staff={staff}
        orders={orders}
        tables={tables}
        customers={customers}
        updateUpdates={updateUpdates}
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
        floors={floors}
        maxDeliveryTime={maxDeliveryTime}
      />
    },
    {
      title: "Payouts",
      content:  
      <Payouts 
        staff={staff} 
        archivedOrders={archivedOrders}
        setIsBlurred={setIsBlurred}
        archivedSessions={archivedSessions}
        tips={tips}
      />
    }
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
      {isBlurred === true &&
          <div className="blur" />
          }
      {views.map((v, i) => (
          v.content
        ))}
      </main>
    </>

  );
}

export default App;