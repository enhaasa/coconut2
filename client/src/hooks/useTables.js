import { useState } from 'react';
import db from '../dbTools_client';

function useTables(init, props) {
    const { 
        selectedTableTracker,
        updateUpdates
    } = props;

    const [tables, setTables] = useState(init);

    function toggleIsAvailable(table) {
        const current = tables[table.id].isAvailable;

        setTables(prev => { 
            prev[table.id].isAvailable = !prev[table.id].isAvailable;
            return [...prev];
        })

        db.tables.put('isAvailable', !current, 'id', table.id);
        updateUpdates("tables");
    }

    function toggleIsReserved(table) {
        const current = tables[table.id].isReserved;

        setTables(prev => {
            prev[table.id].isReserved = !prev[table.id].isReserved;
            return [...prev];
        })
        
        db.tables.put('isReserved', !current, 'id', table.id);
        updateUpdates("tables");
    }

    function setWaiter(table, name) {
        setTables(prev => {
            prev[table.id].waiter = name;
            return [...prev];
        })

        db.tables.put('waiter', name, 'id', table.id);
        updateUpdates("tables");
    }

    function refresh() {
        selectedTableTracker.current === null &&
            db.tables.get().then(res => {setTables(res)});
    }

    return [
        {
            get: tables,
            set: setTables,
            toggleIsAvailable,
            toggleIsReserved,
            setWaiter,
            refresh: refresh
        }
    ]
}

export default useTables;