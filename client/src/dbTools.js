import Axios from "axios";

const baseUrl = process.env.PORT ? `https://${document.location.hostname}` : 'http://localhost:3001';


const menuEndPoint = "/menu";
const menu = {
    get: () => (
        Axios.get(baseUrl + "/menu").then((res) => (
            res.data.map(item => (
                {
                  ...item,
                  ingredients: item.ingredients.split(","),
                  type: item.type === 'drink-alc' ? 'drink' : item.type
                }
            ))
        ))
    )
};

export default {
   menu
};
