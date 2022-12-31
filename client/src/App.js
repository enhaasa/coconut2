import React, { useState, useEffect, useRef } from 'react';
import { Floor } from './components/Floor'
import { TableManager } from './components/TableManager';
import { MenuManager } from './components/MenuManager';
import uuid from 'react-uuid';
import dbTools_client from './dbTools_client';
import Axios from "axios";

//BACKEND_PLACEHOLDER
import ground from './assets/schematics/ground.png';
import basement from './assets/schematics/basement.png';

function App() {

  const maxDeliveryTime = 600000; //Epoch time format; 1000 = one second

  //BACKEND_PLACEHOLDER
  const loggedInAs = "Coco Shev'rin";

  const [menu, setMenu] = useState([]);
  const refreshMenu = () => {
    dbTools_client.menu.get().then(res => {setMenu(res)});
  };

  //BACKEND_PLACEHOLDER
  const [ customers, setCustomers ] = useState([]);
  const refreshCustomers = () => {
    dbTools_client.customers.get().then(res => {setCustomers(res)});
  }

  //BACKEND_PLACEHOLDER
  const [ orders, setOrders ] = useState([]);
  const refreshOrders = () => {
    dbTools_client.orders.get().then(res => {
      setOrders(res.map(item => (
        {...item,
          paid: item.paid === 1 ? true : false,
          delivered: item.delivered === 1 ? true : false
        }
      )))
    });
  }

  const addOrder = (order) => {

    const filteredOrder = {
        customer: order.customer,
        delivered: order.delivered,
        floor: order.floor,
        name: order.name,
        paid: order.paid,
        price: order.price,
        time: order.time,
        type: order.type,
        id: uuid()
    }

    setOrders(prev => ([...prev, filteredOrder]));
    dbTools_client.orders.post(filteredOrder);
    const newUpdateId = uuid();
    ordersUpdateId.current = newUpdateId;
    dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'orders'});
  }

  const deliverOrder = (id) => {
    const index = orders.map(order => order.id).indexOf(id);

    setOrders(prev => (
      [...prev, prev[index].delivered = true]
    ));

    dbTools_client.orders.put({key: 'delivered', value: true, condition_key: 'id', condition_value: id});
    const newUpdateId = uuid();
    ordersUpdateId.current = newUpdateId;
    dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'orders'});
  }

  const deliverAll = (customer) => {
      orders.forEach(order => {
        order.customer === customer && deliverOrder(order.id)
      });
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
      floor: table.floor,
      table: table.id,
      id: uuid()
    }

    setCustomers(prev => (
        [...prev, newCustomer]
    ))

    dbTools_client.customers.post(newCustomer);
    const newUpdateId = uuid();
    customersUpdateId.current = newUpdateId;
    dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'customers'});
    setSelectedCustomer(null);
  }

  const removeCustomer = (id) => {
    removeAllUndeliveredOrders(id);

      setCustomers(prev => (
          prev.filter(customer => (
              customer.id !== id
          ))
      ));

      dbTools_client.customers.delete(id);
      const newUpdateId = uuid();
      customersUpdateId.current = newUpdateId;
      dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'customers'});
      setSelectedCustomer(null);
  }

  const editCustomerName = (id, newName) => {
      const index = customers.map(customer => customer.id).indexOf(id);

      setCustomers(prev => {
        prev[index].name = newName;
        return [...prev];
      }
      )

      dbTools_client.customers.put(id, newName);
      const newUpdateId = uuid();
      customersUpdateId.current = newUpdateId;
      dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'customers'});
  }

  const removeOrder = (id) => {
      setOrders(prev => (
          prev.filter(order => (
              order.id !== id
          ))
      ));

      dbTools_client.orders.delete(id);
      const newUpdateId = uuid();
      ordersUpdateId.current = newUpdateId;
      dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'orders'});
  }

  const removeAllUndeliveredOrders = (customer) => {
      orders.forEach(order => {
        order.customer === customer && 
          order.delivered === false && 
            removeOrder(order.id)
      })
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
  const refreshStaff = () => {
    dbTools_client.staff.get().then(res => {setStaff(res)});
  }

  const [tables, setTables] = useState([]);
  const refreshTables = () => {
    dbTools_client.tables.get().then(res => {setTables(res)});
  }
  
  const toggleTableIsAvailable = (table) => {
    const current = tables[table.id].isAvailable;

    setTables(prev => { 
      prev[table.id].isAvailable = !prev[table.id].isAvailable;
      return [...prev];
    })

    dbTools_client.tables.put({key: 'isAvailable', value: !current, condition_key: 'id', condition_value: table.id});
    const newUpdateId = uuid();
    tablesUpdateId.current = newUpdateId;
    dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'tables'});
  }
  const toggleTableIsReserved = (table) => {
    const current = tables[table.id].isReserved;

    setTables(prev => {
      prev[table.id].isReserved = !prev[table.id].isReserved;
      return [...prev];
    })
    
    dbTools_client.tables.put({key: 'isReserved', value: !current, condition_key: 'id', condition_value: table.id});
    const newUpdateId = uuid();
    tablesUpdateId.current = newUpdateId;
    dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'tables'});
  }
  const setTableWaiter = (table, name) => {
    setTables(prev => {
      prev[table.id].waiter = name;
      return [...prev];
    })

    dbTools_client.tables.put({key: 'waiter', value: name, condition_key: 'id', condition_value: table.id});
    const newUpdateId = uuid();
    tablesUpdateId.current = newUpdateId;
    dbTools_client.updates.put({key: 'id', value: newUpdateId, condition_key: 'table', condition_value: 'tables'});
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

  //Short-polling solution for neanderthals like me :pensive:
  const tablesUpdateId = useRef(null);
  const customersUpdateId = useRef(null); 
  const ordersUpdateId = useRef(null);

  useEffect(() => {
    refreshTables();
    refreshStaff();
    refreshCustomers();
    refreshOrders();
    refreshMenu();

    setInterval(() => {
      dbTools_client.updates.get().then(res => {
        const newTablesUpdateId = res[0].id;
        const newCustomersUpdateId = res[1].id;
        const newOrdersUpdateId = res[2].id;

        if (newTablesUpdateId !== tablesUpdateId.current) {
          refreshTables();
          tablesUpdateId.current = newTablesUpdateId;
        }

        if (newCustomersUpdateId !== customersUpdateId.current) {
          refreshCustomers();
          customersUpdateId.current = newCustomersUpdateId;
        }

        if (newOrdersUpdateId !== ordersUpdateId.current) {
          refreshOrders();
          ordersUpdateId.current = newOrdersUpdateId;
        }
      });
      
    },3000);

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