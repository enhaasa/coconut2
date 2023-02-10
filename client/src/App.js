import React, { useState, useEffect, useRef } from 'react';
import useCustomers from './hooks/useCustomers';
import Floor from './components/Floor'
import TableManager from './components/TableManager';
import MenuManager from './components/MenuManager';
import ReceiptManager from './components/ReceiptManager';
import uuid from 'react-uuid';
import { nanoid } from 'nanoid'
import dbTools_client from './dbTools_client';


//BACKEND_PLACEHOLDER
import ground from './assets/schematics/ground.jpg';
import basement from './assets/schematics/basement.jpg';
import logo from './assets/icons/logo.png';

function App() {

  const [isBlurred, setIsBlurred] = useState(false);

  const maxDeliveryTime = 600000; //Epoch time format; 1000 = one second
  const [ selectedCustomer, setSelectedCustomer ] = useState(null);
  
  const [ selectedTable, setSelectedTable ] = useState(null);
  const selectedTableTracker = useRef(null);  
  useEffect(() => {
    selectedTableTracker.current = selectedTable;
    selectedTable !== null ?
    setIsBlurred(true) :
    setIsBlurred(false);
    setSelectedCustomer(null);
  }, [selectedTable]);

  //BACKEND_PLACEHOLDER
  const loggedInAs = "Coco Shev'rin";

  const [menu, setMenu] = useState([]);
  const refreshMenu = () => {
    dbTools_client.menu.get().then(res => {setMenu(res)});
  };

  const [ customers, setCustomers ] = useState([]);
  const refreshCustomers = () => {
      dbTools_client.customers.get().then(res => {setCustomers(res)});
  }

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

  const [ archivedOrders, setArchivedOrders ] = useState([]);
  const refreshArchivedOrders = () => {
    dbTools_client.archivedOrders.get().then(res => {setArchivedOrders(res)});
  }

  const [staff, setStaff] = useState([]);
  const refreshStaff = () => {
    dbTools_client.staff.get().then(res => {setStaff(res)});
  }

  const [tables, setTables] = useState([]);
  const refreshTables = () => {
    selectedTableTracker.current === null &&
      dbTools_client.tables.get().then(res => {setTables(res)});
  }

  /**
   * Collection of functions to edit orders.
   */
  const handleOrders = { 

    /**
     * Add a new order to the orders array.
     * 
     * @param {object} order - An order object to insert into the orders array.
     */
    add: (order) => {
      const filteredOrder = {
          customer: order.customer,
          delivered: order.delivered,
          floor: order.floor,
          table: order.table,
          name: order.name,
          paid: order.paid,
          price: order.price,
          time: order.time,
          type: order.type,
          id: uuid()
      }
  
      setOrders(prev => ([...prev, filteredOrder]));
      dbTools_client.orders.post(filteredOrder);
      updateUpdates("orders");
    },

     /**
     * Remove a new order to the orders array.
     * 
     * @param {string} id - The id of the order to remove from the orders array.
     */
    remove: function(id) {
      setOrders(prev => (
          prev.filter(order => (
              order.id !== id
          ))
      ));

      dbTools_client.orders.delete(id);
      updateUpdates("orders");
    },

    /**
     * Remove all undelivered orders related to a specific customer.
     * 
     * @param {string} customer - The customer id of which all undelivered orders should be removed.
     */
    removeAllUndelivered: function(customer) {
      orders.forEach(order => {
        order.customer === customer && 
          order.delivered === false && 
            this.remove(order.id)
      })
    },

    /**
     * Remove all unpaid orders related to a specific customer.
     * 
     * @param {string} customer - The customer id of which all unpaid orders should be removed.
     */
    removeAllUnpaid: function(customer) {
      orders.forEach(order => {
        order.customer === customer && 
          order.paid === false && 
            this.remove(order.id)
      })
    },

    /**
     * Set the "delivered" property of an order to true.
     * 
     * @param {string} id - The order id of which the delivered property should be set to true.
     */
    deliver: function(id) {
      const index = orders.findIndex(order => order.id === id);
  
      setOrders(prev => (
        [...prev, prev[index].delivered = true]
      ));
  
      dbTools_client.orders.put('delivered', true, 'id', id);
      updateUpdates("orders");
    },

    /**
     * Set the "delivered" property to true for all orders related to a customer.
     * 
     * @param {string} customer - The customer id of which all related orders should be set to true.
     */
    deliverAll: function(customer) {
      orders.forEach(order => {
        order.customer === customer && this.deliver(order.id)
      });
    },

    /**
     * Add an order to the archived_orders array and remove it from the normal orders array.
     * 
     * @param {string} orderid - The order id of which order should be moved.
     * @param {string} session - A session id of which to give the item when pushed into the archived_orders array.
     */
    pay: function(orderId, session) {
      const index = orders.findIndex(order => order.id === orderId);
      const order = orders[index];
      const customerName = customers[customers.findIndex(customer => customer.id === order.customer)].name;
  
      const filteredOrder = {
        id: orderId,
        customerName: customerName,
        floor: order.floor,
        name: order.name,
        table: order.table,
        price: order.price,
        type: order.type,
        session: session,
        time: order.time
      }
    
      dbTools_client.archivedOrders.post(filteredOrder);
      this.remove(orderId);
      updateUpdates("archived_orders");
    },

    /**
     * Add an array of order objects to the archived_orders array and then remove them from the orders array.
     * 
     * @param {object[]} orders - The array of items should be moved.
     * @param {string} table - The table id of the related table.
     */
    payAll: function(orders, table) {
      const session = nanoid(5);

      orders.forEach(order => {
        this.pay(order.id, session);
      })
  
      setTables(prev => {
        prev[table].session = session;
        return [...prev];
      })
  
      dbTools_client.tables.put('session', session, 'id', table);
      updateUpdates("tables");
    }
  }

  /**
   * Collection of functions to edit customers.
   */
  const handleCustomers = {
    add: function(table) {
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
      updateUpdates("customers");
      setSelectedCustomer(null);
    },

    remove: (id, table) => {
      handleOrders.removeAllUndelivered(id);
      handleOrders.removeAllUnpaid(id);
  
      setCustomers(prev => (
          prev.filter(customer => (
              customer.id !== id
          ))
      ));
  
      const customersInTable = customers.filter(customer => (
        customer.table === table.id
      ));
      
      if (customersInTable.length-1 === 0) {
        dbTools_client.tables.put('session', null, 'id', table.id);
  
        setTables(prev => {
          prev[table.id].session = null;
          return [...prev];
        })
      }
      
      dbTools_client.customers.delete(id);
      updateUpdates("customers");
      setSelectedCustomer(null);
    },

    editName: function(id, newName) {
      const index = customers.map(customer => customer.id).indexOf(id);

      setCustomers(prev => {
        prev[index].name = newName;
        return [...prev];
      }
      )

      dbTools_client.customers.put(id, newName);
      updateUpdates("customers");
    }
  }

  /**
   * Collection of functions to edit tables.
   * 
   */
  const handleTables = {
    toggleIsAvailable: function(table) {
      const current = tables[table.id].isAvailable;
  
      setTables(prev => { 
        prev[table.id].isAvailable = !prev[table.id].isAvailable;
        return [...prev];
      })
  
      dbTools_client.tables.put('isAvailable', !current, 'id', table.id);
      updateUpdates("tables");
    },

    toggleIsReserved: function(table) {
      const current = tables[table.id].isReserved;
  
      setTables(prev => {
        prev[table.id].isReserved = !prev[table.id].isReserved;
        return [...prev];
      })
      
      dbTools_client.tables.put('isReserved', !current, 'id', table.id);
      updateUpdates("tables");
    },

    setWaiter: function(table, name) {
      setTables(prev => {
        prev[table.id].waiter = name;
        return [...prev];
      })
  
      dbTools_client.tables.put('waiter', name, 'id', table.id);
      updateUpdates("tables");
    }
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
  
  const updateUpdates = (table) => {
    const newUpdateId = uuid();
    ordersUpdateId.current = newUpdateId;
    dbTools_client.updates.put('id', newUpdateId, 'name', table);
  }


  const tablesUpdateId = useRef(null);
  const customersUpdateId = useRef(null); 
  const ordersUpdateId = useRef(null);
  const archivedOrdersUpdateId = useRef(null);

  const checkUpdates = () => {
    //Tables to check
    const tables = [{
        name: "tables",
        id: tablesUpdateId,
        refresh: refreshTables
      },{
        name: "customers",
        id: customersUpdateId,
        refresh: refreshCustomers
      },{
        name: "orders",
        id: ordersUpdateId,
        refresh: refreshOrders
      },{
        name: "archived_orders",
        id: archivedOrdersUpdateId,
        refresh: refreshArchivedOrders
      }];

      dbTools_client.updates.get().then(res => {
        tables.forEach(table => {
          const currentId = res.find(obj => obj.name === table.name).id;

          if (selectedTableTracker.current !== null) return; //Do not update when a table is open

          if (table.id !== currentId) {
            table.refresh();
            table.id.current = table.id;
          }
        })
      })
  }


  //Short-polling solution
  useEffect(() => {
    //Initial updates
    refreshMenu();
    refreshTables();
    refreshStaff();
    refreshCustomers();
    refreshOrders();
    refreshArchivedOrders();

    setInterval(() => {
      checkUpdates();
    }, 2000);

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
              customers={customers}
              table={tables[selectedTable]} 
              handleOrders={handleOrders}
              handleCustomers={handleCustomers}
              setSelectedTable={setSelectedTable}
              setSelectedCustomer={setSelectedCustomer}
              handleTables={handleTables}
              />

            {selectedCustomer !== null &&
              <MenuManager 
                menu={menu}
                selectedCustomer={selectedCustomer}
                handleOrders={handleOrders}
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