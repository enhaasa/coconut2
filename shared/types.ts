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
           typeof seating.section_name === 'string' &&
           Array.isArray(seating.customers) && seating.customers.every(isValidCustomer) &&
           typeof seating.waiter === 'string';
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