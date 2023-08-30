import React, { useMemo, createContext, useEffect, useContext } from 'react';
import useSections from './hooks/useSections';
import useSectionPointers from './hooks/useSectionPointers';
import useSeatings from './hooks/useSeatings';
import useArchivedSessions from './hooks/useArchivedSessions';
import useOrders from './hooks/useOrders';
import useCustomers from './hooks/useCustomers';
import useTips from './hooks/useTips';
import useMenu from './hooks/useMenu';
import useStaff from './hooks/useStaff';
import useServices from './hooks/useServices';
import useMessages from './hooks/useMessages';
import usePendingRequests from './hooks/usePendingRequests';

import { ControlStatesContext } from './ControlStates';
import useServiceMenu from './hooks/useServiceMenu';


const DynamicDataContext = createContext();

function DynamicDataProvider(props) {

  const {
    children, 
    socket, 
    selectedSeatingTracker, 
  } = props;

  const {
    setSelectedCustomer,
    selectedCustomer,
  } = useContext(ControlStatesContext);


  const archivedSessions = useArchivedSessions([], {
    socket
  });
  const tips = useTips([], { socket: socket });
  const staff = useStaff([], { socket: socket });

  const sections = useSections([], {
      socket
  });

  const sectionPointers = useSectionPointers([], {
    socket
  });

  const seatings = useSeatings([], {
    selectedSeatingTracker: selectedSeatingTracker, 
    socket
  });

  const orders = useOrders([], {
      archivedSessions: archivedSessions,
      socket
  });

  const services = useServices([], {
    socket
  });

  const customers = useCustomers([], {
    setSelectedCustomer,
    selectedCustomer,
    orders: orders,
    socket
  });

  const menu = useMenu([], {
    selectedSeatingTracker, 
    socket
  });

  const serviceMenu = useServiceMenu([], {
    socket
  });

  const messages = useMessages([], {
    socket
  });

  const pendingRequestIDs = usePendingRequests([], {
    socket
  });

  function getDataTree() {
    const dataTree = [];
    const sectionMap = new Map();
    const seatingMap = new Map();
  
    sections.get.forEach(section => {
      const sectionData = { ...section, seatings: [] };
      dataTree.push(sectionData);
      sectionMap.set(section.id, sectionData);
    });
  
    seatings.get.forEach(seating => {
      const sectionData = sectionMap.get(seating.section_id);
  
      if (sectionData) {
        const seatingData = { ...seating, customers: [] };
        sectionData.seatings.push(seatingData);
        seatingMap.set(seating.id, seatingData);
      }
    });
  
    customers.get.forEach(customer => {
      const seatingData = seatingMap.get(customer.seating_id);
  
      if (seatingData) {
        const customerData = { ...customer, undeliveredOrders: [], deliveredOrders: [] };
        seatingData.customers.push(customerData);
      }
    });
  
    orders.get.forEach(order => {
      const seatingData = seatingMap.get(order.seating_id);
    
      if (seatingData) {
        const customerData = seatingData.customers.find(
          customer => customer.id === order.customer_id
        );
    
        if (customerData) {
          const orderData = {
            name: order.name,
            amount: 1,
            total: order.price,
            ...order,
          };
    
          if (order.is_delivered) {
            customerData.deliveredOrders.push(orderData);
          } else {
            customerData.undeliveredOrders.push(orderData);
          }
        }
      }
    });
    

    return dataTree;
  }
  
  const dataTree = useMemo(() => {
      return [...getDataTree()];
  }, [sections.get, seatings.get, customers.get, orders.get]);

  useEffect(() => {
      if (socket) {
          sections.refresh();
          sectionPointers.refresh();
          seatings.refresh();
          orders.refresh();
          services.refresh();
          customers.refresh();
          archivedSessions.refresh();
          tips.refresh();
          menu.refresh();
          serviceMenu.refresh();
          staff.refresh();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
      <DynamicDataContext.Provider value={{ 
              orders,
              services,
              customers,
              sections, 
              sectionPointers,
              tips,
              seatings,
              menu,
              staff,
              serviceMenu,
              archivedSessions,
              dataTree,
              messages,
              pendingRequestIDs,
          }}>
          {children}
      </DynamicDataContext.Provider>
  );
}

export { DynamicDataProvider, DynamicDataContext };