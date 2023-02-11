import { useState } from 'react';
import dbTools_client from '../dbTools_client';

function useStaff(init) {
    const [staff, setStaff] = useState(init);

    function refresh() {
      dbTools_client.staff.get().then(res => {setStaff(res)});
    }

    return [
        {
            get: staff,
            refresh: refresh
        }
    ]
}

export default useStaff;