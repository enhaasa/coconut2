//Components
import TableItem from './common/Table/TableItem';
import Button from './common/Button/Button';
import IconButton from './common/IconButton/IconButton';

//Contexts
import { DynamicDataContext } from '../api/DynamicData';
import { useContext } from 'react';

//Icons
import infoIcon from './../assets/icons/info-small-white.png';
import plusIcon from './../assets/icons/plus-white.png';
import minusIcon from './../assets/icons/minus-white.png';

//Tools
import { formatStringAsPrice } from '../tools';

export default function Order(props) {
    const { 
        order,
    } = props;

    const {
        orders,
    } = useContext(DynamicDataContext);

    function handleAddOrder(order) {
        const orderToDuplicate = order.units[0];
        orders.add(orderToDuplicate);
    }

    function handleRemoveOrder(order) {
        orders.remove(order.units[order.units.length-1]);
    }

    const tablecols = [
        {
            type: 'nav',
            content: 
            <>
                <IconButton type='tooltip'>
                    <img src={infoIcon} alt='' className='tooltip' />

                    <span className='tooltiptext'>
                        {order.item}
                    </span>
                </IconButton>
            </>
        }, {
            type: 'main',
            content: order.name
        }, {
            type: 'text',
            content: `x${order.amount}`
        }, {
            type: 'nav',
            content: 
            <>
                <IconButton clickEvent={() => handleRemoveOrder(order)}>
                    <img src={minusIcon} alt='' />
                </IconButton>

                <IconButton clickEvent={() => handleAddOrder(order)}>
                    <img src={plusIcon} alt='' />
                </IconButton>
            </>
        }, {
            type: 'text',
            content: order.total.toLocaleString('en-US') + ' gil'
        }
    ];

    if (!order.units[0].is_delivered) {
        tablecols.push({
            type: 'nav',
            content: 
            <>
                <Button 
                    type='neutral' 
                    ID={`DeliverOrder${order.units[order.units.length-1].id}`}
                    pendingResponseClickEvent={{
                        args: [order.units[(order.units.length-1)]],
                        event: orders.deliver
                    }}>
                Deliver
                </Button>
            </>
        });
    }

    return (
        <TableItem cols={tablecols}/>
    )
}
