import React, { useEffect, useState } from 'react';
import { Floor } from './Floor'
import { TableManager } from './TableManager';
import uuid from 'react-uuid';

//BACKEND_PLACEHOLDER
import ground from './assets/schematics/ground.png';
import basement from './assets/schematics/basement.png';

function App() {

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

  //BACKEND_PLACEHOLDER
  const [tables, setTables] = useState([
    {
      posX: 638,
      posY: 335,
      isReserved: false,
      type: "ground",
      id: uuid()
    },
    {
      posX: 638,
      posY: 410,
      isReserved: false,
      type: "ground",
      id: uuid()
    },
    {
      posX: 135,
      posY: 130,
      isReserved: false,
      type: "basement",
      id: uuid()
    },
    {
      posX: 350,
      posY: 25,
      isReserved: false,
      type: "basement",
      id: uuid()
    }
  ]);

  const [ selectedFloor, setSelectedFloor ] = useState(1);
  const [ selectedTable, setSelectedTable ] = useState(null);

  return (
    <div className="shell">

      <section className="TableManagerContainer">
        <TableManager ID={selectedTable}/>
      </section>

      <section className="FloorContainer">
          {
            floors.map((floor, index) => {
              return (
                <button key={index} onClick={()=> {setSelectedFloor(index)}}>{floor.title}</button>
              )
            })
          }
          
          <Floor floor={floors[selectedFloor]} tables={tables} setTables={setTables} setSelectedTable={setSelectedTable}/>
      </section>
    </div>
  );
}

export default App;