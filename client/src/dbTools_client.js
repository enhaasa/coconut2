import Axios from "axios";
 
//`https://${document.location.hostname}`;
//'http://localhost:3001';
const baseUrl = 'http://localhost:3001';
const extUrl = "https://enhasa.dev/cocosoasis/api/db";

const weeklySpecial = {
    get: async function(type) {
        return await fetch(extUrl + "/getMenuWeekly.php?type=" + type)
        .then(response => response.json())
        .then(data => data);
    }
}


const menu = {
    table: "menu",
    get: async function() {
        return Axios.post(baseUrl + "/get", {table: this.table}).then((res) => (
            res.data.map(item => (
                {
                  ...item,
                  ingredients: item.ingredients.split(","),
                  type: item.type === 'drink-alc' ? 'drink' : item.type
                } 
            ))
        ))
    }
}


const floors = {
    table: "floors",
    get: async function () {
        return Axios.post(baseUrl + "/get", {table: this.table}).then((res) => (
            res.data
        ));
    }
}

const staff = {
    table: "staff",
    get: async function () {
        return Axios.post(baseUrl + "/get", {table: this.table}).then((res) => (
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
    table: "tables",
    get: async function () {
        return Axios.post(baseUrl + "/get", {table: this.table}).then((res) => (
            res.data
        ));
    },
    put: async function (key, value, condition_key, condition_value) {
        Axios.post(baseUrl + "/update", {table: this.table, data: {
            key: key, 
            value: value, 
            condition_key: condition_key, 
            condition_value: condition_value}});
    }
}

const customers = {
    table: "customers",
    get: async function () {
        return Axios.post(baseUrl + "/get", {table: this.table}).then((res) => (
            res.data
        ));
    },
    post: async function (customer) {
        Axios.post(baseUrl + "/post", {table: this.table, data: {...customer}});
    },
    delete: async function (id) {
        Axios.post(baseUrl + "/delete", {table: this.table, data: {id: id}});
    },
    put: async function (id, name) {
        Axios.post(baseUrl + "/update", {table: this.table, data: {
            key: '`name`',
            value: name,
            condition_key: '`id`',
            condition_value: id
        }});
    }
}

const orders = {
    table: "orders",
    get: async function () {
        return Axios.post(baseUrl + "/get", {table: this.table}).then((res) => (
            res.data
        ));
    },
    post: async function (item) {
        Axios.post(baseUrl + "/post", {table: this.table, data: {...item}});
    },
    delete: async function (id) {
        Axios.post(baseUrl + "/delete", {table: this.table, data: { id: id } });
    },
    put: async function (key, value, condition_key, condition_value) {
        Axios.post(baseUrl + "/update", {table: this.table, data: {
            key: key, 
            value: value, 
            condition_key: condition_key, 
            condition_value: condition_value}});
    }
}

const archivedOrders = {
    table: "archived_orders",
    get: async function () {
        return Axios.post(baseUrl + "/get", {table: this.table}).then((res) => (
            res.data
        ));
    },
    post: async function (item) {
        Axios.post(baseUrl + "/post", {table: this.table, data: {...item}});
    },
    delete: async function (id) {
        Axios.post(baseUrl + "/delete", {table: this.table, data: { id: id } });
    },
    put: async function (data) {
        Axios.post(baseUrl + "/update", {table: this.table, data: data});
    }
}

const updates = {
    table: "updates",
    get: async function () {
        return Axios.post(baseUrl + "/get", {table: this.table}).then((res) => (
            res.data
        ));
    },
    post: async function (table, id) {
        Axios.post(baseUrl + "/post", {table: table, data: {id: id}})
    },
    put: async function (key, value, condition_key, condition_value) {
        Axios.post(baseUrl + "/update", {table: this.table, data: {
            key: key, 
            value: value, 
            condition_key: condition_key, 
            condition_value: condition_value}});
    }
}

export default {
   menu,
   weeklySpecial,
   floors,
   staff,
   tables,
   customers,
   archivedOrders,
   orders,
   updates
};
