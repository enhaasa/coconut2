import { useState } from 'react';
import db from '../dbTools_client';

function useMenu(init, props) {
    const {
        selectedTable
    } = props;

    const [menu, setMenu] = useState(init);

    async function refresh() {
        selectedTable === null &&
            db.menu.get().then(raw => {

                setMenu(raw) //Swap out with below to activate special prices.
                //sortWeeklySpecials(raw).then(sorted => setMenu(sorted));
            });

    }

    

    async function sortWeeklySpecials(menu) {

        const weeklySpecials = ["meal", "cocktail"];

        //Group all promises and await all at once
        const promises = weeklySpecials.map(special => db.weeklySpecial.get(special));
        const specialItems = await Promise.all(promises);

        //Adjust prices
        menu = menu.map(item => (
            specialItems.find(specialItem => specialItem.id === item.id) ? {...item, price: item.price/2} : item
        ))
        
        return await menu;
    }


    return [
        {
            get: menu,
            refresh: refresh
        }
    ]
}

export default useMenu;