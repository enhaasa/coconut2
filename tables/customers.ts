import db from './../database';

module.exports = function registerHandlers(io) {
    io.on("connection", (socket => {
        socket.on("addCustomer", (data) => Customers.add(socket, data));
        socket.on("removeCustomer", (data) => Customers.remove(socket, data));
        socket.on("editCustomerName", (data) => Customers.editName(socket, data));
    }));
}

class Customers {
    private static table = 'customers';

    public static add(socket, data) {
        db.add(this.table, data.customer);
        socket.broadcast.emit('addCustomer', data.customer);
    }

    public static remove(socket, data) {
        db.remove(this.table, data.id);
        socket.broadcast.emit('removeCustomer', data.id, data.table);
    }

    public static editName(socket, data) {
        db.update(this.table, 'name', data.name, data.id);
        socket.broadcast.emit('editCustomerName', data.id, data.name);
    }
}