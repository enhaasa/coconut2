import infoIcon from './../assets/icons/info.png';
import plusIcon from './../assets/icons/plus-black.png';
import minusIcon from './../assets/icons/minus-black.png';
import { DynamicDataContext } from '../api/DynamicData';
import { useContext } from 'react';

export default function Order(props) {
    const { 
        order,
    } = props;

    const {
        orders,
    } = useContext(DynamicDataContext);

    function handleAddOrder(order) {

        const orderToDuplicate = order.units[0];
        delete orderToDuplicate.id;
        delete orderToDuplicate.amount;
        delete orderToDuplicate.uuid;

        console.log(orderToDuplicate);

        orders.add(orderToDuplicate);
    }

    function handleRemoveOrder(order) {
        orders.remove(order.units[order.units.length-1]);
    }

    function handleDeliverOrder(order) {
        orders.deliver(order.units[(order.units.length-1)]);
    }


    return (
        <tr>
            <td>{order.name}</td>
            <td>{order.price.toLocaleString("en-US")} gil</td>
            <td>{order.units.length}</td>
            <td>{order.total.toLocaleString("en-US")} gil</td>
            <td className="tableNav">
                <button className="icon tooltip">
                    <img src={infoIcon} alt="" className="tooltip" />

                    <span className="tooltiptext">
                        {order.item}
                    </span>
                </button>
            </td>

            <td className="tableNav end">
                <button className="icon" onClick={() => {handleRemoveOrder(order)}}>
                    <img src={minusIcon} alt="" />
                </button>
                <button className="icon" onClick={() => {handleAddOrder(order)}}>
                    <img src={plusIcon} alt="" />
                </button>
                <button className="text constructive" onClick={() => {handleDeliverOrder(order)}}>Deliver </button>
            </td>
        </tr>
    )
}