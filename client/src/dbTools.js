import Axios from "axios";

const baseUrl = process.env.PORT ? `https://${document.location.hostname}` : 'http://localhost:3001';


const menu = {
    endpoint: "/menu",
    get: async function() {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data.map(item => (
                {
                  ...item,
                  ingredients: item.ingredients.split(","),
                  type: item.type === 'drink-alc' ? 'drink' : item.type
                }
            ))
        ))
    }
};

const floors = {
    endpoint: "/floors",
    get: async function () {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data
        ))
    }
}

const staff = {
    endpoint: "/staff",
    get: async function () {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data.map(item => (
                {
                    ...item,
                    positions: item.positions.split(",")
                }
            ))
        ))
    }
}

const tables = {
    endpoint: "/tables",
    get: async function () {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data
        ))
    }
}

export default {
   menu,
   floors,
   staff,
   tables
};
