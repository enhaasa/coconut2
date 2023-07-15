import { useState } from 'react';
import useSocketListener from './../useSocketListener';
import db from '../../dbTools_client';

function useTables(init, props) {
    const { 
        selectedTableTracker, 
        socket
    } = props;

    const [tables, setTables] = useState(init);
    const eventHandlers = {
        getTables: (tables) => {
            setTables(tables);
        },
        setTableSessionID: (data) => {
            const { id, session_id } = data;
            const index = tables.findIndex(table => table.id === id);
            
            setTables(prev => {
                prev[index].session_id = session_id;
                return [...prev];
            });
        },
        setTableAttribute: (data) => {
            const {table, attribute, value} = data;
            console.log("received")

            setTables(prev => {
                const index = prev.findIndex(t => t.id === table.id);

                prev[index][attribute] = value;
                return [...prev];
            });
        }
    }

    useSocketListener(socket, eventHandlers);

    function setSessionID(id, session_id) {
        socket.emit("setTableSessionID", { id: id, session_id: session_id});
    }

    function toggleAttribute(table, attribute) {
        const current = tables.find(t => t.id === table.id)[attribute];
        console.log(attribute + " is " + current)
        setAttribute(table, attribute, !current);
    }

    function setAttribute(table, attribute, value) {
        socket.emit('setTableAttribute', { table, attribute, value })
    }

    function toggleIsReserved(table) {
        const current = tables[table.id].isReserved;
        setIsReserved(table, !current)
    }

    function setIsReserved(table, option) {
        setTables(prev => {
            prev[table.id].isReserved = option;
            return [...prev];
        })
        
        db.tables.put('isReserved', option, 'id', table.id);
    }

    function toggleIsPhotography(table) {
        const current = tables[table.id].isPhotography;
        setIsPhotography(table, !current);
    }

    function setIsPhotography(table, option) {
        setTables(prev => {
            prev[table.id].isPhotography = option;
            return [...prev];
        })
        
        db.tables.put('isPhotography', option, 'id', table.id);
    }

    function setWaiter(table, name) {
        setTables(prev => {
            prev[table.id].waiter = name;
            return [...prev];
        })

        db.tables.put('waiter', name, 'id', table.id);
    }

    function refresh() {
        /*
        selectedTableTracker.current === null &&
            db.tables.get().then(res => {setTables(res)});
            */
        socket.emit("getTables");
    }

    return [
        {
            get: tables,
            set: setTables,
            toggleAttribute,
            setAttribute,
            setSessionID,
            toggleIsPhotography,
            setIsPhotography,
            toggleIsReserved,
            setIsReserved,
            setWaiter,
            refresh: refresh
        }
    ]
}

export default useTables;