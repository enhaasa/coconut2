import { useState } from 'react';
import db from '../dbTools_client';

function useStaff(init) {
    const [staff, setStaff] = useState(init);

    function refresh() {
      db.staff.get().then(res => {setStaff(res)});
    }

    return [
        {
            get: staff,
            refresh: refresh
        }
    ]
}

export default useStaff;