import { useState } from 'react';
import dbTools_client from '../dbTools_client';

function useMenu(init, props) {
    const {
        selectedTable
    } = props;

    const [menu, setMenu] = useState(init);

    function refresh() {
     selectedTable === null &&
      dbTools_client.menu.get().then(res => {setMenu(res)});
    }

    return [
        {
            get: menu,
            refresh: refresh
        }
    ]
}

export default useMenu;