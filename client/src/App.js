import React, { useState, useEffect, useRef } from 'react';
import useCustomers from './hooks/useCustomers';
import useOrders from './hooks/useOrders';
import useMenu from './hooks/useMenu';
import useStaff from './hooks/useStaff';
import useArchivedOrders from './hooks/useArchivedOrders';
import useTables from './hooks/useTables';
import Floor from './components/Floor'
import TableManager from './components/TableManager';
import MenuManager from './components/MenuManager';
import ReceiptManager from './components/ReceiptManager';
import uuid from 'react-uuid';
import dbTools_client from './dbTools_client';


//BACKEND_PLACEHOLDER
import ground from './assets/schematics/ground.jpg';
import basement from './assets/schematics/basement.jpg';
import logo from './assets/icons/logo.png';

function App() {

  const loggedInAs = "Coco Shev'rin"; //BACKEND_PLACEHOLDER
  const maxDeliveryTime = 600000; //Epoch time format; 1000 = one second

  const [isBlurred, setIsBlurred] = useState(false);

  const [ selectedFloor, setSelectedFloor ] = useState(1);
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);
  const [ selectedTable, setSelectedTable ] = useState(null);

  //Temporary solution to useEffect not having access to updated values in component state
  const selectedTableTracker = useRef(null);  
  useEffect(() => {
    selectedTableTracker.current = selectedTable;
    selectedTable !== null ?
    setIsBlurred(true) :
    setIsBlurred(false);
    setSelectedCustomer(null);
  }, [selectedTable]);

  const updateUpdates = (table) => {
    const newUpdateId = uuid();
    dbTools_client.updates.put('id', newUpdateId, 'name', table);
  }

  //BACKEND_PLACEHOLDER
  const floors = [
    {
      title: "Basement",
      type: "basement",
      schematics: basement
    },
    {
      title: "Ground Floor",
      type: "ground",
      schematics: ground
    }
  ];

  const [ tables ] = useTables([], {
    selectedTableTracker: selectedTableTracker,
    updateUpdates: updateUpdates
  });

  const [ orders ] = useOrders([], {
    updateUpdates: updateUpdates
  });

  const [ customers ] = useCustomers([], {
    updateUpdates: updateUpdates, 
    setSelectedCustomer,
    orders: orders
  });

  const [ menu ] = useMenu([], {selectedTable});
  const [ archivedOrders ] = useArchivedOrders([]);
  const [ staff ] = useStaff([]);

  const tablesToUpdate = [
  {
    name: "tables",
    id: useRef(null),
    refresh: tables.refresh
  },{
    name: "customers",
    id: useRef(null),
    refresh: customers.refresh
  },{
    name: "orders",
    id: useRef(null),
    refresh: orders.refresh
  },{
    name: "archived_orders",
    id: useRef(null),
    refresh: archivedOrders.refresh
  }];

  /**
   * Requests a list of all update ID's from the server, then checks if they match the ID's on the client.
   * If it doesn't match then it will grab a fresh copy of the corresponding SQL table and update the state
   * of the relevant array with the new data. 
   * 
   * This will prevent needless refreshing and expensive traffic.
   */
  const checkUpdates = () => {
    //Tables to check
      if (selectedTableTracker.current !== null) return; //Do not update when a table is open

      dbTools_client.updates.get().then(res => {
        tablesToUpdate.forEach(table => {
          const currentId = res.find(obj => obj.name === table.name).id;

          if (table.id.current !== currentId) {
            table.refresh();
            table.id.current = currentId;
          }
        })
      })
  }


  const pollingInterval = 2000; //Time in milliseconds

  //Short-polling solution
  useEffect(() => {
    //Initial updates
    menu.refresh();
    tables.refresh();
    staff.refresh();
    customers.refresh();
    orders.refresh();
    archivedOrders.refresh();

    setInterval(() => {
      checkUpdates();
    }, pollingInterval);

  }, []);

  return (
    <div className="shell">

      {isBlurred === true &&
        <div className="blur" />
        }

      <section className="TableManagerContainer">

        {selectedTable !== null &&         
          <>
            <TableManager 
              staff={staff}
              orders={orders}
              tables={tables}
              customers={customers}
              table={tables.get[selectedTable]} 
              setSelectedTable={setSelectedTable}
              setSelectedCustomer={setSelectedCustomer}
              />

            {selectedCustomer !== null &&
              <MenuManager 
                menu={menu}
                selectedCustomer={selectedCustomer}
                orders={orders}
                setSelectedCustomer={setSelectedCustomer}
              />
            }
          </>
        }
      </section>

      <section className="FloorContainer">
        <nav className="floorNav">
          <span className="floorColumn">
            {floors.map((floor, index) => {
                return (
                    <div className="floorSelector" key={uuid()}>
                      <div className="notificationBar">
                        {orders.get.filter(order => order.floor === floor.type && !order.delivered).length > 0 &&
                            <span className="notificationContainer">
                              <span className="notification progressive">
                                <span className="number">
                                  {orders.get.filter(order => order.floor === floor.type && !order.delivered).length}
                                </span>
                              </span>
                            </span>}
                      </div>

                      <button 
                        className={`floorButton ${selectedFloor === index ? "constructive" : "inactive"}`} 
                        key={index} 
                        onClick={() => {setSelectedFloor(index)}}>
                        <span className="title">{floor.title}</span>
                      </button>
                    </div>
                )
              })
            }
          </span>

          <div className="appInfo">
              <span className="logo">
                <img src={logo} alt="" />
              </span>
          
              <span className="text">
                <span className="title cursive">Coconut</span>
                <span className="version">by Enhasa</span>
              </span>
          </div>
        </nav>
          
        <Floor 
          loggedInAs={loggedInAs}
          floor={floors[selectedFloor]} 
          tables={tables} 
          maxDeliveryTime={maxDeliveryTime}
          setSelectedTable={setSelectedTable}
          orders={orders}
          customers={customers}
        />
      </section>

      {
        <section className="ReceiptManagerContainer">
          <ReceiptManager 
            archivedOrders={archivedOrders}
          />
        </section>
      }
    
    </div>
  );
}

export default App;