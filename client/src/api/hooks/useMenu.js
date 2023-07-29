import { useState } from 'react';
import useSocketListener from './../useSocketListener';

export default function useMenu(init, props) {
    const {
        socket
    } = props;

    const [menu, setMenu] = useState(init);
    const eventHandlers = {
        getMenu: (menu_items) => {
            sortWeeklySpecials(menu_items);
        }
    }

    useSocketListener(socket, eventHandlers);

    async function refresh() {
        socket.emit('getMenu');
    }

    async function sortWeeklySpecials(menu_items) {
        const weeklySpecials = ['meal', 'cocktail'];
    
        // Group all promises and await all at once
        const promises = weeklySpecials.map(special =>
            fetch(`https://enhasa.dev/cocosoasis/api/db/getMenuWeekly.php?type=${special}`).then(response => response.json())
        );
    
        let specialItems = await Promise.all(promises);
    
        // Adjust prices
        const parsedMenu = menu_items.map(item => {
            const specialItem = specialItems.find(specialItem => specialItem.name === item.name);
            return specialItem ? { ...item, price: item.price / 2 } : item;
        });
    
        setMenu(parsedMenu);
    }


    return [
        {
            get: menu,
            refresh: refresh
        }
    ]
}