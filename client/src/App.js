import React, { useState, useEffect } from 'react';
import { Floor } from './components/Floor'
import { TableManager } from './components/TableManager';
import { MenuManager } from './components/MenuManager';
import uuid from 'react-uuid';
import dbTools from './dbTools';
import Axios from "axios";

//BACKEND_PLACEHOLDER
import ground from './assets/schematics/ground.png';
import basement from './assets/schematics/basement.png';

function App() {

  const maxDeliveryTime = 600000; //Epoch time format; 1000 = one second

  //BACKEND_PLACEHOLDER
  const loggedInAs = "Coco Shev'rin";

  const [menu, setMenu] = useState([]);

  //BACKEND_PLACEHOLDER
  const [ customers, setCustomers ] = useState([]);

  //BACKEND_PLACEHOLDER
  const [ orders, setOrders ] = useState([]);

  const addOrder = (order) => {
    setOrders(prev => ([...prev, {
        ...order,
        id: uuid()
    }]));
  }

  const deliverOrder = (id) => {
    const index = orders.map(order => order.id).indexOf(id);

    setOrders(prev => (
      [...prev, prev[index].delivered = true]
    ));
  }

  const deliverAll = (customer) => {
    setOrders(prev => (
      prev.map(order => (
        customer === order.customer ? {...order, delivered: true} : order
      ))
    ));
  }

  const payOrders = (orderIds) => {
    setOrders(prev =>(
      prev.map(order => (
        orderIds.includes(order.id) ? {...order, paid: true} : order
      ))
    ));
  }

  const addCustomer = (table) => {

    const newCustomer = {
      name: "",
      table: table.id,
      floor: table.floor,
      id: uuid()
    }

    setCustomers(prev => (
        [...prev, newCustomer]
    ))

    dbTools.customers.post(newCustomer);
    setSelectedCustomer(null);
  }

  const removeCustomer = (id) => {
    removeAllUndeliveredOrders(id);

      setCustomers(prev => (
          prev.filter(customer => (
              customer.id !== id
          ))
      ));

      dbTools.customers.delete(id);
      setSelectedCustomer(null);
  }

  const editCustomerName = (id, newName) => {
      const index = customers.map(customer => customer.id).indexOf(id);

      setCustomers(prev => {
        prev[index].name = newName;
        return [...prev];
      }
      )

      dbTools.customers.put(id, newName);
  }

  const removeOrder = (id) => {
      setOrders(prev => (
          prev.filter(order => (
              order.id !== id
          ))
      ));
  }

  const removeAllUndeliveredOrders = (id) => {
      setOrders(prev => (
          prev.filter(order => (
            order.customer === id ? order.delivered : true
          ))
      ));
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

  const [ selectedFloor, setSelectedFloor ] = useState(1);

  const [staff, setStaff] = useState([]);

  const [tables, setTables] = useState([]);
  
  const toggleTableIsAvailable = (table) => {
    setTables(prev => { 
      prev[table.id].isAvailable = !prev[table.id].isAvailable;
      return [...prev];
    })
  }
  const toggleTableIsReserved = (table) => {
    setTables(prev => {
      prev[table.id].isReserved = !prev[table.id].isReserved;
      return [...prev];
    })
  }
  const setTableWaiter = (table, name) => {
    setTables(prev => {
      prev[table.id].waiter = name;
      return [...prev];
    })
  }

  const [ selectedTable, setSelectedTable ] = useState(null);
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);

  useEffect(() => {
    selectedTable !== null ?
    setIsBlurred(true) :
      setIsBlurred(false);
  });

  useEffect(() => {
    setSelectedCustomer(null);
  }, [selectedTable]);

  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    dbTools.tables.get().then(res => {setTables(res)});
    dbTools.staff.get().then(res => {setStaff(res)});
    dbTools.customers.get().then(res => {setCustomers(res)});
    dbTools.orders.get().then(res => {setOrders(res)});
    dbTools.menu.get().then(res => {setMenu(res)});
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
              toggleTableIsAvailable={toggleTableIsAvailable} 
              toggleTableIsReserved={toggleTableIsReserved} 
              setSelectedTable={setSelectedTable}
              setTableWaiter={setTableWaiter} 
              table={tables[selectedTable]} 
              staff={staff}
              orders={orders}
              addOrder={addOrder}
              removeOrder={removeOrder}
              removeAllUndeliveredOrders={removeAllUndeliveredOrders}
              deliverOrder={deliverOrder}
              deliverAll={deliverAll}
              payOrders={payOrders}
              customers={customers}
              addCustomer={addCustomer}
              removeCustomer = {removeCustomer}
              editCustomerName = {editCustomerName}
              setSelectedCustomer={setSelectedCustomer}
              />

            {selectedCustomer !== null &&
              <MenuManager 
                menu={menu}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                addOrder={addOrder}
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
                        {orders.filter(order => order.floor === floor.type && !order.delivered).length > 0 &&
                            <span className="notificationContainer">
                              <span className="notification progressive">
                                <span className="number">
                                  {orders.filter(order => order.floor === floor.type && !order.delivered).length}
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
              <span className="title cursive">Coconut</span>
              <span className="version">by Enhasa</span>
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
    </div>
  );
}

export default App;