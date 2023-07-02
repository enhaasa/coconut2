import { useState } from 'react';
import db from '../dbTools_client';

function useTables(init, props) {
    const { 
        selectedTableTracker,
    } = props;

    const [tables, setTables] = useState(init);

    function toggleIsAvailable(table) {
        const current = tables[table.id].isAvailable;
        setIsAvailable(table, !current);
    }

    function setIsAvailable(table, option) {
        setTables(prev => { 
            prev[table.id].isAvailable = option;
            return [...prev];
        })

        db.tables.put('isAvailable', option, 'id', table.id);
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
        selectedTableTracker.current === null &&
            db.tables.get().then(res => {setTables(res)});
    }

    return [
        {
            get: tables,
            set: setTables,
            toggleIsAvailable,
            setIsAvailable,
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