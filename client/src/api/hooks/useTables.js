import { useState } from 'react';
import useSocketListener from './../useSocketListener';

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
            const { table, attribute, value } = data;
            const index = tables.findIndex(t => t.id === table.id);

            setTables(prev => {
                prev[index][attribute] = value;
                return [...prev];
            });
        },
        resetTable: (tableToReset) => {
            const index = tables.findIndex(table => table.id === tableToReset.id);

            setTables(prev => {
                prev[index].is_available = true;
                prev[index].is_reserved = false;
                prev[index].is_photography = false;

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
        setAttribute(table, attribute, !current);
    }

    function setAttribute(table, attribute, value) {
        socket.emit('setTableAttribute', { table, attribute, value })
    }

    function reset(table) {
        socket.emit("resetTable", { ...table })
    }

    function refresh() {
        socket.emit("getTables");
    }

    return [
        {
            get: tables,
            set: setTables,
            reset,
            toggleAttribute,
            setAttribute,
            setSessionID,
            refresh: refresh
        }
    ]
}

export default useTables;