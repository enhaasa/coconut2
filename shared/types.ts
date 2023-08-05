export type Order = {
    is_delivered: boolean;
    name: string;
    price: number;
    section_id: number;
    customer_id: number;
    seating_id: number;
    realm_id: number;
    menu_id: number;
    item: string;
    time: number;
    date: string;
    id: string;
}
export function isValidOrder(order: any): order is Order {
    return typeof order.is_delivered === 'boolean' &&
           typeof order.name === 'string' &&
           typeof order.price === 'number' &&
           typeof order.section_id === 'number' &&
           typeof order.customer_id === 'number' &&
           typeof order.seating_id === 'number' &&
           typeof order.menu_id === 'number' &&
           typeof order.item === 'string' &&
           typeof order.realm_id === 'number' &&
           typeof order.time === 'number' &&
           typeof order.date === 'string' &&
           typeof order.id === 'number';
}

export type Customer = {
    id: number;
    name: string;
    section_id: number;
    seating_id: number;
    session_id: number|unknown;
    realm_id: number;
}
export function isValidCustomer(customer: any): customer is Customer {
    return typeof customer.id === 'number' &&
           typeof customer.name === 'string' &&
           typeof customer.section_id === 'number' &&
           typeof customer.seating_id === 'number' &&
           typeof customer.realm_id === 'number';
}

export type Seating = {
    id: number;
    pos_x: number;
    pos_y: number;
    is_reserved: boolean;
    is_available: boolean;
    is_photography: boolean;
    realm_id: number;
    section_id: number;
    number: number;
    waiter: string;
    section_name: string;
    customers: Customer[];
}

export function isValidSeating(seating: any): seating is Seating {
    return typeof seating.id === 'number' &&
           typeof seating.number === 'number' &&
           typeof seating.section_id === 'number' &&
           Array.isArray(seating.customers) && seating.customers.every(isValidCustomer) &&
           typeof seating.waiter === 'string' &&
           typeof seating.pos_x === 'number' &&
           typeof seating.pos_y === 'number' &&
           typeof seating.is_reserved === 'boolean' &&
           typeof seating.is_available === 'boolean' &&
           typeof seating.is_photography === 'boolean';
}

export type Tip = {
    name: string;
    amount: number;
    realm_id: number;
    datetime: string;
    id: number;
}

export function isValidTip(tip: any): tip is Tip {
    return typeof tip.name === 'string' &&
           typeof tip.amount === 'number' &&
           typeof tip.realm_id === 'number' &&
           typeof tip.datetime === 'string' &&
           typeof tip.id === 'number';
}

export type Character = {
    id: number;
    bio: string;
    gender: string;
    hired_date: string;
    is_active: boolean;
    is_attending: boolean;
    name: string;
    positions: string;
    title: string;
    image_url: null|string;
    user_id: number;
    realm_id: number;
}

export function isValidCharacter(data: any): data is Character {
    return typeof data.id === 'number' &&
           typeof data.bio === 'string' &&
           typeof data.gender === 'string' &&
           typeof data.hired_date === 'string' &&
           typeof data.is_active === 'boolean' &&
           typeof data.is_attending === 'boolean' &&
           typeof data.name === 'string' &&
           typeof data.positions === 'string' &&
           typeof data.title === 'string' &&
           (data.image_url === null || typeof data.image_url === 'string') &&
           typeof data.user_id === 'number' &&
           typeof data.realm_id === 'number';
}

export type Session = {
    id: number;
    waiter: string;
    channel: {
        name: number;
        section_name: string;
    };
    customers: string[];
    orders: Order[];
    price: number;
    amount_paid: number;
    realm_id: number;
    datetime: string; 
}

export function isValidSession(data: any): data is Session {
    const isChannelValid = 
        data.channel &&
        typeof data.channel.name === 'number' &&
        typeof data.channel.section_name === 'string';

    const areCustomersValid = 
        Array.isArray(data.customers) &&
        data.customers.every(customer => typeof customer === 'string');

    const areOrdersValid = Array.isArray(data.orders);  // Could be further refined if a specific Order structure is known

    return (
        typeof data.id === 'number' &&
        typeof data.waiter === 'string' &&
        isChannelValid &&
        areCustomersValid &&
        areOrdersValid &&
        typeof data.price === 'number' &&
        typeof data.amount_paid === 'number' &&
        typeof data.realm_id === 'number' &&
        typeof data.datetime === 'string'
    );
}
