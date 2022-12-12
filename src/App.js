import React, { useState, useEffect } from 'react';
import { Floor } from './components/Floor'
import { TableManager } from './components/TableManager';
import { MenuManager } from './components/MenuManager';
import uuid from 'react-uuid';


//BACKEND_PLACEHOLDER
import ground from './assets/schematics/ground.png';
import basement from './assets/schematics/basement.png';

function App() {

  const maxDeliveryTime = 600000; //Epoch time format; 1000 = one second

  //BACKEND_PLACEHOLDER
  const loggedInAs = "Coco Shev'rin";

  //BACKEND_PLACEHOLDER
  const menu = [
    {
      name: "Slutty Sultana",
      type: "cocktail",
      price: 1000,
      ingredients: ["tequila", "crushed cassis berries", "lime", "ginger beer"],
      menuId: "j6d6"
    }, {
      name: "Curry Plate",
      type: "meal",
      price: 3000,
      menuId: "hs5srt"
    }, {
      name: "Red Wine",
      type: "drink",
      price: 200,
      menuId: "hs5hs5g"
    }, {
      name: "White Wine",
      type: "drink",
      price: 200,
      menuId: "5gfnaw4"
    }, {
      name: "Sushi Plate",
      type: "meal",
      price: 3000,
      menuId: "shrt"
    }, {
      name: "Soba",
      type: "meal",
      price: 3000,
      menuId: "shrhsa"
    }, {
      name: "Grilled Corn",
      type: "dessert",
      price: 1500,
      menuId: "uo98sg"
    }, {
      name: "Tequila",
      type: "shot",
      price: 300,
      menuId: "ahge35h"
    }, {
      name: "Gin",
      type: "shot",
      price: 300,
      menuId: "a45ye35h"
    }, {
      name: "Raki",
      type: "shot",
      price: 300,
      menuId: "u4e6"
    }, {
      name: "Doman Tea Set",
      type: "hightea",
      price: 500,
      menuId: "908srt"
    }, {
      name: "Chamomile Tea Set",
      type: "hightea",
      price: 500,
      menuId: "us098uh"
    }, {
      name: "Ale",
      type: "drink",
      price: 300,
      menuId: "smgeiopuh"
    }
  ]

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
    setCustomers(prev => (
        [...prev, {
            name: "",
            table: table.id,
            floor: table.floor,
            id: uuid()
        }]
    ))

    setSelectedCustomer(null);
  }

  const removeCustomer = (id) => {
    removeAllUndeliveredOrders(id);

      setCustomers(prev => (
          prev.filter(customer => (
              customer.id !== id
          ))
      ));

      setSelectedCustomer(null);
  }

  const editCustomerName = (id, newName) => {
      const index = customers.map(customer => customer.id).indexOf(id);

      setCustomers(prev => {
        prev[index].name = newName;
        return [...prev];
      }
      )
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

  //BACKEND_PLACEHOLDER
  const staff = [
    {
      name: "Coco Shev'rin",
      positions: ["waiter", "owner", "bartender", "dancer"]
    },
    {
      name: "Nessa Grimm",
      positions: ["waiter", "bartender"]
    },
    {
      name: "Livia Nightbelt",
      positions: ["waiter"]
    }
  ];

  //BACKEND_PLACEHOLDER
  const [tables, setTables] = useState([
    {
      posX: 750,
      posY: 381,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "ground",
      id: 0
    },
    {
      posX: 750,
      posY: 550,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "ground",
      id: 1
    },
    {
      posX: 190,
      posY: 155,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "basement",
      id: 2
    },
    {
      posX: 417,
      posY: 65,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "basement",
      id: 3
    },
    {
      posX: 575,
      posY: 65,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "basement",
      id: 4
    },
    {
      posX: 740,
      posY: 65,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "basement",
      id: 5
    },
    {
      posX: 900,
      posY: 225,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "basement",
      id: 6
    },
    {
      posX: 900,
      posY: 390,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "basement",
      id: 7
    },
    {
      posX: 742,
      posY: 555,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "basement",
      id: 8
    },
    {
      posX: 585,
      posY: 555,
      isReserved: false,
      isAvailable: true,
      waiter: "Coco Shev'rin",
      floor: "basement",
      id: 9
    },
    {
      posX: 420,
      posY: 555,
      isReserved: false,
      isAvailable: true,
      waiter: "Nessa Grimm",
      floor: "basement",
      id: 10
    }
  ]);
  
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
              <span className="version">alpha-2.0</span>
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