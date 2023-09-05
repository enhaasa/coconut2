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
import AddServiceItem from "./_AddServiceItem";
import Modal from '../common/Modal/Modal';

//Icons
import infoIcon from './../../assets/icons/info-small-white.png';

export default function ServiceItems(props) {

    const {
        handleModal,
    } = props;

    const {
        selectedCustomer
    } = useContext(ControlStatesContext);

    const {
        serviceMenu,
    } = useContext(DynamicDataContext);

    const menuTypes = serviceMenu.get
        .map(menuItem => menuItem.type)
        .filter((item, index, array) => (array.indexOf(item) === index));

    function getPrice(item) {
        if (item.minute_interval === 0) {
            return `${item.price.toLocaleString('en-US')} gil`;
        } 
        return `${item.price.toLocaleString('en-US')} gil / ${item.minute_interval} minutes`;
    }

    return (
        <div className='ServiceItems'>
            {serviceMenu.get.length === 0 ? 'No services here...' :
            menuTypes.map(menuType => (
                <div className='type' key={uuid()}>
                    <div className='type-title cursive'>{capitalizeFirstLetter(menuType)}</div>

                    {serviceMenu.get.map(item => (
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
                                                    type='neutral'
                                                    clickEvent={() => handleModal(
                                                        <Modal closeButtonEvent={() => handleModal(null)} title={item.name}>
                                                            <AddServiceItem item={item} handleModal={handleModal} />
                                                        </Modal>
                                                    )}
                                                >{getPrice(item)}</Button>
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