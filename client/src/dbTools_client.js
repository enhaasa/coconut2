import Axios from "axios";
 
//`https://${document.location.hostname}`;
//'http://localhost:3001';
const baseUrl = `https://${document.location.hostname}`;

function get(endpoint) {
    return async function() {
        return await Axios.get(baseUrl + endpoint).then((res) => (
            res.data
        ));
    }
}

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
        ));
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
        ));
    }
}

const tables = {
    endpoint: "/tables",
    get: async function () {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data
        ));
    },
    put: async function (key, value, condition_key, condition_value) {
        Axios.put(baseUrl + this.endpoint, {data: {
            key: key, 
            value: value, 
            condition_key: condition_key, 
            condition_value: condition_value}});
    }
}

const customers = {
    endpoint: "/customers",
    get: async function () {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data
        ));
    },
    post: async function (customer) {
        Axios.post(baseUrl + this.endpoint, {...customer});
    },
    delete: async function (id) {
        Axios.delete(baseUrl + this.endpoint, { data: {id: id} });
    },
    put: async function (id, name) {
        Axios.put(baseUrl + this.endpoint, {id: id, name: name});
    }
}

const orders = {
    endpoint: "/orders",
    get: async function () {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data
        ));
    },
    post: async function (item) {
        Axios.post(baseUrl + this.endpoint, {...item});
    },
    delete: async function (id) {
        Axios.delete(baseUrl + this.endpoint, {data: { id: id } });
    },
    put: async function (key, value, condition_key, condition_value) {
        Axios.put(baseUrl + this.endpoint, {data: {
            key: key, 
            value: value, 
            condition_key: condition_key, 
            condition_value: condition_value}});
    }
}

const archivedOrders = {
    endpoint: "/archivedOrders",
    get: async function () {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data
        ));
    },
    post: async function (item) {
        Axios.post(baseUrl + this.endpoint, {...item});
    },
    delete: async function (id) {
        Axios.delete(baseUrl + this.endpoint, {data: { id: id } });
    },
    put: async function (data) {
        Axios.put(baseUrl + this.endpoint, {data});
    }
}

const updates = {
    endpoint: "/updates",
    get: async function () {
        return Axios.get(baseUrl + this.endpoint).then((res) => (
            res.data
        ));
    },
    post: async function (table, id) {
        Axios.post(baseUrl + this.endpoint, {table: table, id: id})
    },
    put: async function (key, value, condition_key, condition_value) {
        Axios.put(baseUrl + this.endpoint, {data: {
            key: key, 
            value: value, 
            condition_key: condition_key, 
            condition_value: condition_value}});
    }
}

export default {
   menu,
   floors,
   staff,
   tables,
   customers,
   archivedOrders,
   orders,
   updates
};
