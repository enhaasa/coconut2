import React from 'react';

//Components
import Table from '../common/Table/Table';
import TableItem from '../common/Table/TableItem';

//Tools
import uuid from 'react-uuid';
import { compareDates, calculatePPMTotal } from '../../utils';

export default function CombinedTab(props) {

    const { 
        deliveredOrdersInSeating, 
        completedServices,
    } = props;

    let parsedDeliveredOrders = [];
    deliveredOrdersInSeating.forEach(order => {

        const currentOrder = parsedDeliveredOrders.find(parsedOrder => parsedOrder.name === order.name && parsedOrder.price === order.price);

        if (!currentOrder) {
            parsedDeliveredOrders.push({
                amount: 1,
                name: order.name,
                item: order.item,
                price: order.price,
                total: order.price,
                units: [order]
            })
        } else {
            currentOrder.amount += 1;
            currentOrder.total += order.price;
            currentOrder.units.push(order);
        }
    });

    return( 
        <>  
            <div className='title'>Orders</div>
            <Table>
                {parsedDeliveredOrders.map(order => (       
                    <TableItem 
                        key={uuid()}
                        cols={
                            [
                                {
                                    type: 'text',
                                    content: order.name
                                }, {
                                    type: 'number',
                                    content: `${order.price.toLocaleString('en-US')} gil`
                                }, {
                                    type: 'number',
                                    content: `x${order.amount}`
                                }, {
                                    type: 'number',
                                    content: `${order.total.toLocaleString('en-US')} gil`
                                }
                            ]
                        }
                    >
                    </TableItem>  
                ))}
            </Table>
            
            <div className='title'>Services</div>
            <Table>
                {completedServices.map(service => (
                    <TableItem 
                        key={uuid()}
                        cols={
                            [
                                {
                                    type: 'text',
                                    content: service.name
                                }, {
                                    type: 'text',
                                    content: compareDates(service.start_datetime, service.end_datetime)
                                }, {
                                    type: 'number',
                                    content: `${service.total && service.total.toLocaleString('en-US')} gil`
                                }
                            ]
                        }
                    
                    />
                ))}
            </Table>
        </>
    );
}
