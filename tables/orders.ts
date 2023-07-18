import Database from './../database';
import { Socket, Server } from 'socket.io';
import { Time } from '../dbTools_server';
import uuid = require('react-uuid');

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getOrders', () => Orders.get(socket));
        socket.on('addOrder', (order) => Orders.add(io, order));
        socket.on('deliverOrder', (order => Orders.deliver(io, order)));
        socket.on('deliverAllByCustomer', (customer => Orders.deliverAllByCustomer(io, customer)));
        socket.on('removeOrder', (uuid) => Orders.remove(io, uuid));
        socket.on('removeAllOrdersByTableID', (data) => Orders.removeAllByTableID(socket, data));
        socket.on('payOrdersInTable', (data) => Orders.payOrdersInTable(io, data))
    }));
}

export class Orders {
    private static table = 'orders';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await Database.query(query);

        socket.emit('getOrders', result)
    }

    public static async add(io: Server, order) {
        
        const parsed_order = {
            is_delivered: order.is_delivered,
            name: order.name,
            price: order.price,
            section_id: order.section_id,
            menu_id: order.menu_id,
            customer_id: order.customer_id,
            table_id: order.table_id,
            item: order.item,
            realm_id: 1,
            time: Time.getCurrentTime(),
            date: Time.getCurrentDateTime(),
            uuid: uuid(),
        }
        
        const new_order_id = await Database.add(this.table, parsed_order, "id");

        io.emit('addOrder', {...parsed_order, id: new_order_id});
    }

    public static deliver(io: Server, order) {
        Database.update(this.table, 'is_delivered', true, 'uuid', order.uuid);

        io.emit('deliverOrder', order)
    }

    public static deliverAllByCustomer(io: Server, customer) {
        Database.update(this.table, 'is_delivered', true, 'customer_id', customer.id);
        
        io.emit('deliverAllByCustomer', customer);
    }

    public static async payOrdersInTable(io: Server, data) {
        const { orders, table } = data;

        const { waiter, customers, section_name, number } = table;
        const price = orders.reduce((total: number, order) => (total + order.price), 0);

        const channel = {
            name: number,
            section_name,
        }

        const archived_session = {
            waiter,
            channel: JSON.stringify(channel),
            customers: JSON.stringify(customers.map(customer => customer.name)),
            orders: JSON.stringify(orders),
            price,
            datetime: Time.getCurrentDateTime(),
            amount_paid: price,
            realm_id: 1,
        }

        const session_id = await Database.add('archived_sessions', archived_session, 'id');
        const delete_delivered_orders_query = `
            DELETE FROM "orders" 
            WHERE "is_delivered" = true
            AND "table_id" = ${table.id}
        `;

        if(session_id) {
            Database.query(delete_delivered_orders_query, [], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    io.emit('removeAllDeliveredOrdersFromTable', table);
                    io.emit('addArchivedSession', {...archived_session, id: session_id[0].id});
                }
            });
        } else {
            console.log("Failed to get new session ID from database.")
        }
    }

    public static remove(io: Server, order) {
        Database.remove(this.table, 'uuid', order.uuid);
        io.emit('removeOrder', order);
    }

    public static removeAllByTableID(socket: Socket, data) {
        Database.remove(this.table, '`table`', data.id);
        socket.broadcast.emit('removeAllOrdersByTableID');
    }
}