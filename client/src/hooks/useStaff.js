import { useState } from 'react';
import db from '../dbTools_client';

function useStaff(init, props) {
    const { updateUpdates } = props;

    const [staff, setStaff] = useState(init);

    function refresh() {
      db.staff.get().then(res => {setStaff(
        res.filter(s => s.isActive)
      )});
    }

    function toggleIsAttending(id, isAttending) {
      db.staff.put("isAttending", isAttending, "id", id);

      const index = staff.map(s => s.id).indexOf(id);
      setStaff(prev => {
        prev[index].isAttending = isAttending;
        return [...prev]; 
      });
      updateUpdates("staff");
    }

    return [
        {
            get: staff,
            refresh: refresh,
            toggleIsAttending: toggleIsAttending
        }
    ]
}

export default useStaff;