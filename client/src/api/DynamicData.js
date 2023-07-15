import React, { useMemo, createContext, useEffect } from 'react';
import useSections from './hooks/useSections';
import useTables from './hooks/useTables';
import useArchivedOrders from './hooks/useArchivedOrders';
import useArchivedSessions from './hooks/useArchivedSessions';
import useOrders from './hooks/useOrders';
import useCustomers from './hooks/useCustomers';
import useSessions from './hooks/useSessions';
import useTips from './hooks/useTips';
import useMenu from './hooks/useMenu';
import useStaff from './hooks/useStaff';

const DynamicDataContext = createContext();

function DynamicDataProvider({ children, socket, selectedTableTracker, setSelectedCustomer }) {
  const [ archivedOrders ] = useArchivedOrders([]);
  const [ archivedSessions ] = useArchivedSessions([]);
  const [ tips ] = useTips([]);
  const [ staff ] = useStaff([], { socket: socket });

  const [ sections ] = useSections([], {
      socket: socket
  });

  const [ tables ] = useTables([], {
      selectedTableTracker: selectedTableTracker, 
      socket: socket
  });

  const [ orders ] = useOrders([], {
      archivedOrders: archivedOrders,
      archivedSessions: archivedSessions,
      socket: socket
  });

  const [ customers ] = useCustomers([], {
      setSelectedCustomer,
      orders: orders,
      socket: socket
  });

  const [ sessions ] = useSessions([], {
      socket: socket
  });

  const [ menu ] = useMenu([], {
      selectedTableTracker, 
      socket: socket
  });

  function getDataTree() {
    const dataTree = [];
    const sectionMap = new Map();
    const tableMap = new Map();
  
    sections.get.forEach(section => {
      const sectionData = { ...section, tables: [] };
      dataTree.push(sectionData);
      sectionMap.set(section.id, sectionData);
    });
  
    tables.get.forEach((table, index) => {
      const sectionData = sectionMap.get(table.section_id);
  
      if (sectionData) {
        const tableData = { ...table, customers: [] };
        sectionData.tables.push(tableData);
        tableMap.set(table.id, tableData);
      }
    });
  
    customers.get.forEach(customer => {
      const tableData = tableMap.get(customer.table_id);
  
      if (tableData) {
        const customerData = { ...customer, orders: [] };
        tableData.customers.push(customerData);
      }
    });

    orders.get.forEach(order => {
      const tableData = tableMap.get(order.table_id);
  
      if (tableData) {
        const customerData = tableData.customers.find(
          customer => customer.id === order.customer_id
        );
  
        if (customerData) {
          const existingGroup = customerData.orders.find(group => group.name === order.name);

          if (existingGroup) {
            existingGroup.units.push(order);
            existingGroup.amount += 1;
            existingGroup.total += order.price;
          } else {
            customerData.orders.push({
              name: order.name,
              units: [order],
              amount: 1,
              total: order.price,
              item: order.item,
              time: order.time,
            });
          }
        }
      }
    });
  
    return dataTree;
  }
  
    
  const dataTree = useMemo(() => {
      return [...getDataTree()];
  }, [sections.get, tables.get, customers.get, orders.get]);


  
  useEffect(() => {
      if (socket) {
          sections.refresh();
          tables.refresh();
          orders.refresh();
          customers.refresh();
          archivedSessions.refresh();
          archivedOrders.refresh();
          sessions.refresh();
          tips.refresh();
          menu.refresh();
          staff.refresh();
      }
  }, [socket]);

  return (
      <DynamicDataContext.Provider value={{ 
              orders,
              customers,
              sections, 
              sessions,
              tips,
              tables,
              menu,
              staff,
              archivedOrders, 
              archivedSessions,
              dataTree,
          }}>
          {children}
      </DynamicDataContext.Provider>
  );
}

export { DynamicDataProvider, DynamicDataContext };