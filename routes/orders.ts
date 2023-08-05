import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';
import { Time } from '../dbTools_server';
import { Customer } from '../shared/types';
import { Seating, isValidSeating } from '../shared/types';
import { Order, isValidOrder } from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getOrders', () => Orders.get(socket));
        socket.on('addOrder', (order) => Orders.add(io, socket, order));
        socket.on('deliverOrder', (order => Orders.deliver(io, socket, order)));
        socket.on('deliverAllByCustomer', (customer => Orders.deliverAllByCustomer(io, socket, customer)));
        socket.on('removeOrder', (uuid) => Orders.remove(io, socket, uuid));
        socket.on('payOrdersInSeating', (data) => Orders.payOrdersInSeating(io, socket, data))
    }));
}

type OrderToAdd = {
    is_delivered: boolean;
    name: string;
    price: number;
    section_id: number;
    customer_id: number;
    seating_id: number;
    menu_id: number;
    item: string;
}

type OrdersInSeating = {
    orders: Order[],
    seating: Seating,
}

function isValidOrderToAdd(order: any): order is OrderToAdd {
    return typeof order.is_delivered === 'boolean' &&
           typeof order.name === 'string' &&
           typeof order.price === 'number' &&
           typeof order.section_id === 'number' &&
           typeof order.customer_id === 'number' &&
           typeof order.seating_id === 'number' &&
           typeof order.menu_id === 'number' &&
           typeof order.item === 'string';
}

function isValidOrderToDeliver(order: any): order is Pick<Order, 'id'> {
    return typeof order.id === 'number';
}

function isValidCustomer(customer: any): customer is Customer {
    return typeof customer.id === 'number';
}

function isValidOrdersInSeating(data: any): data is OrdersInSeating {
    return Array.isArray(data.orders) && data.orders.every(isValidOrderToAdd) &&
           isValidSeating(data.seating);
}

export class Orders {
    private static table = 'orders';

    public static async get(socket: Socket) {
        try {
            const result = await Database.get(this.table);
            socket.emit('getOrders', result)
        } catch (err) {
            console.log('Failed to fetch orders.', err);
            MessageHandler.sendError(socket, 'Failed to fetch orders.');
        }
        
    }

    public static async add(io: Server, socket: Socket, order: any) {
        if (!isValidOrderToAdd(order)) {
            console.log('Invalid format: OrderToAdd', order);
            MessageHandler.sendError(socket, 'Invalid format: OrderToAdd.');
            return;
        }
        
        try {
            const parsed_order = {
                is_delivered: order.is_delivered,
                name: order.name,
                price: order.price,
                section_id: order.section_id,
                menu_id: order.menu_id,
                customer_id: order.customer_id,
                seating_id: order.seating_id,
                item: order.item,
                realm_id: 1,
                time: Time.getCurrentTime(),
                date: Time.getCurrentDateTime(),
            }
    
            const result = await Database.add(this.table, parsed_order, 'id');
            const id = result[0].id;

            if (id) {
                io.emit('addOrder', {...parsed_order, id: id});
            } else {
                MessageHandler.sendError(socket, 'Failed to add order.');
            }
        } catch (err) {
            console.error('Failed to add order:', err);
            MessageHandler.sendError(socket, 'Failed to add order.');
        }
    }

    public static async deliver(io: Server, socket: Socket, order: any) {
        if (!isValidOrderToDeliver(order)) {
            console.log('Invalid format: OrderToDeliver', order);
            MessageHandler.sendError(socket, 'Invalid format: OrderToDeliver.');
            return;
        }

        try {
            const result = await Database.update(this.table, 'is_delivered', true, 'id', order.id);

            if (result) {
                io.emit('deliverOrder', order);
            } else {
                console.error('Failed to deliver order.');
                MessageHandler.sendError(socket, 'Failed to deliver order.');
            }
            io.emit('deliverOrder', order);
        } catch (err) {
            console.error('Failed to deliver order:', err);
            MessageHandler.sendError(socket, 'Failed to deliver order.');
        }
    }

    public static async deliverAllByCustomer(io: Server, socket: Socket, customer: any) {
        if (!isValidCustomer(customer)) {
            console.log('Invalid format: Customer', customer);
            MessageHandler.sendError(socket, 'Invalid format: Customer.');
            return;
        }
    
        try {
            const result = await Database.update(this.table, 'is_delivered', true, 'customer_id', customer.id);
    
            if (result) {
                io.emit('deliverAllOrdersByCustomer', customer);
            } else {
                console.error('Failed to deliver all orders for customer.');
                MessageHandler.sendError(socket, 'Failed to deliver all orders for customer.');
            }
        } catch (err) {
            console.error('Failed to deliver all orders for customer:', err);
            MessageHandler.sendError(socket, 'Failed to deliver all orders for customer.');
        }
    }

    public static async payOrdersInSeating(io: Server, socket: Socket, data: any) {
        if (!isValidOrdersInSeating(data)) {
            console.log('Invalid format: OrdersInSeating');
            MessageHandler.sendError(socket, 'Invalid format: OrdersInSeating. Your request was refused.');
            return;
        }
        
        const { orders, seating } = data;
        const { waiter, customers, section_name, number } = seating;
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
    
        try {
            const result = await Database.add('archived_sessions', archived_session, 'id');
            const id = result[0].id;
    
            if (id) {
                const delete_delivered_orders_query = `
                    DELETE FROM "orders" 
                    WHERE "is_delivered" = true
                    AND "seating_id" = ${seating.id}
                `;
                
                try {
                    await Database.query(delete_delivered_orders_query);
                    io.emit('removeAllDeliveredOrdersFromSeating', seating);
                    io.emit('addArchivedSession', {...archived_session, id: id});
                } catch (err) {
                    console.log('Failed to delete delivered orders from the database:', err);
                    MessageHandler.sendError(socket, 'Failed to delete delivered orders from the database. Please try again.');
                }
            } else {
                console.log("Failed to get new session ID from database.")
                MessageHandler.sendError(socket, 'Failed to archive the session. Please try again.');
            }
        } catch (err) {
            console.log('Failed to add archived session to the database:', err);
            MessageHandler.sendError(socket, 'Failed to archive the session. Please try again.');
        }
    }

    public static async remove(io: Server, socket: Socket, order: any) {
        delete order.amount;
        if (!isValidOrder(order)) {
            console.log('Invalid format: Order', order);
            MessageHandler.sendError(socket, 'Invalid format: Order.');
            return;
        }
    
        try {
            const result = await Database.remove(this.table, 'id', order.id);

            if (result) {
                io.emit('removeOrder', order);
            } else {
                MessageHandler.sendError(socket, 'Failed to remove order.');
            }
        } catch (err) {
            console.error('Failed to remove order:', err);
            MessageHandler.sendError(socket, 'Failed to remove order.');
        }
    }
}