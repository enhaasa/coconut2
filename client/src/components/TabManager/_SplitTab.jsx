import React, { useContext } from 'react';

//Components
import Order from '../Order';
import Table from '../common/Table/Table';
import TableItem from '../common/Table/TableItem';
import Button from '../common/Button/Button';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Tools
import uuid from 'react-uuid';
import { compareDates, calculatePPMTotal } from '../../utils';

export default function SplitTab(props) {
    const { 
        customersInSeating,
    } = props;

    const {
        services
    } = useContext(DynamicDataContext);

    function parseOrderList(list) {
        let parsedDeliveredOrders = [];
        list.forEach(order => {
    
            const currentOrder = parsedDeliveredOrders.find(parsedOrder => 
                parsedOrder.name === order.name && parsedOrder.price === order.price);
    
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

        return parsedDeliveredOrders;
    }

    return ( 
        customersInSeating.map(customer => (
            <div key={uuid()}>
                <span className='name'>{customer.name}</span>

                {customer.deliveredOrders.length > 0 &&
                    <>
                        <div className='title'>Orders</div>
                        <Table>
                            {parseOrderList(customer.deliveredOrders).map(order => (
                                <Order 
                                    key={uuid()}
                                    order={order} 
                                /> 
                            ))}
                        </Table>
                    </>
                }
                
                {customer.completedServices.length > 0 &&
                    <>
                        <div className='title'>Services</div>
                        <Table>
                            {customer.completedServices.map(service => (
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
                                                content: 
                                                    `${services.utils.calculatePPMTotal(
                                                        service.start_datetime, 
                                                        service.end_datetime, 
                                                        service.minute_interval, 
                                                        service.price
                                                    ).toLocaleString('en-US')} gil`
                                            }, {
                                                type: 'nav',
                                                content:
                                                    <>
                                                        <Button 
                                                            type='destructive' 
                                                            ID={`RemoveService${service.id}`}
                                                            pendingResponseClickEvent={{
                                                                args: [{
                                                                    service
                                                                }],
                                                                event: services.remove
                                                            }}>Remove
                                                        </Button>
                                                    </>
                                            }
                                        ]
                                    }
                                
                                />
                            ))}
                        </Table>
                    </>
                }
            </div>
        ))
    )
}

