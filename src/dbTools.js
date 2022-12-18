import Axios from "axios";

const getMenu = async () => {
    return Axios.get("http://localhost:3001/menu").then(res => (
        res.data
    ));
}

const test = () => {
    console.log(getMenu());
}

export default {
    getMenu,
    test
};
