import { useContext } from "react";

//Contexts
import { DynamicDataContext } from "../../api/DynamicData";
import { ControlStatesContext } from "../../api/ControlStates";

//Tools
import uuid from "react-uuid";
import { capitalizeFirstLetter } from '../../utils/names';

//Components
import Button from "../common/Button/Button";
import MenuInfoModal from './_MenuInfoModal';

//Icons
import infoIcon from './../../assets/icons/info-small-white.png';

export default function DiningItems(props) {

    const {
        handleModal,
    } = props;

    const {
        selectedCustomer
    } = useContext(ControlStatesContext);

    const {
        menu,
        orders
    } = useContext(DynamicDataContext);

    const menuTypes = menu.get
        .map(menuItem => menuItem.type)
        .filter((item, index, array) => (array.indexOf(item) === index));

    function filterItem(item) {
        return {
            name: item.name,
            is_delivered: false,
            price: item.price,
            item: item.item,
            seating_id: selectedCustomer.seating_id,
            section_id: selectedCustomer.section_id,
            customer_id: selectedCustomer.id,
            menu_id: item.id,
        }
    }

    return (
        <div className='DiningItems'>
            {menu.get.length === 0 ? 'No items here...' :
            menuTypes.map(menuType => (
                <div className='type' key={uuid()}>
                    <div className='type-title cursive'>{capitalizeFirstLetter(menuType) + 's'}</div>

                    {menu.get.map(item => (
                        menuType === item.type && 
                            item.available !== 0 &&
                                <div className='item-container' key={item.id}>
                                    <div className='item'>
                                        <span className='item-title'>
                                            <button 
                                                className='item-info-button' 
                                                onClick={() => {handleModal(<MenuInfoModal item={item} handleModal={handleModal}/>)}}>
                                                <img src={infoIcon} alt='' />
                                            </button>

                                            <span className='item-name'>
                                                {item.name}     
                                            </span>
                                        </span>

                                        {selectedCustomer &&
                                            <nav className='item-nav'>
                                                <Button 
                                                    type='constructive' 
                                                    ID={`AddOrder${item.id}`}
                                                    pendingResponseClickEvent={{
                                                        args: [
                                                            {...filterItem(item)}
                                                        ],
                                                        event: orders.add
                                                    }
                                                }>{item.price.toLocaleString('en-US')} gil</Button>

                                                <Button type='neutral' 
                                                    ID={`AddOrder${item.id}Free`}
                                                    pendingResponseClickEvent={{
                                                        args: [
                                                            {...filterItem(item)},
                                                        ],
                                                        event: orders.add
                                                    }
                                                }>Free</Button>
                                            </nav>
                                        }

                                    </div>

                                    <div className='item-info'>
                                        {item.id}
                                    </div>
                                </div>
                    ))}
                </div>
            ))}
        </div>
    );
}