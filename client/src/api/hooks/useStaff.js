import { useState } from 'react';
import useSocketListener from '../useSocketListener';

function useStaff(init, props) {
    const [staff, setStaff] = useState(init);
    const { socket } = props;

    const eventHandlers = {
      getStaff: (staff) => {
          setStaff(staff);
      },
      setStaffAttribute: (data) => {
        const { staff_member, attribute, value } = data;

        setStaff(prev => {
          const index = prev.findIndex(t => t.id === staff_member.id);

          prev[index][attribute] = value;
          return [...prev];
        })
      }
    }

    useSocketListener(socket, eventHandlers);

    function refresh() {
      socket.emit('getStaff');
    }

    function setAttribute(staff_member, attribute, value) {
      console.log(attribute)
      socket.emit('setStaffAttribute', { staff_member, attribute, value })
    }

    return [
        {
            get: staff,
            refresh,
            setAttribute,
        }
    ]
}

export default useStaff;