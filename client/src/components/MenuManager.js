import React, { useState, useLayoutEffect, useRef, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import Infobox from './Infobox';
import tools from '../tools';
import uuid from 'react-uuid';
import gsap from 'gsap';
import animations from '../animations';

import closeIcon from './../assets/icons/close.png';
import infoIcon from './../assets/icons/info-small-black.png';

export default function MenuManager(props) {
    const { 
        setSelectedCustomer,
        selectedCustomer,
    } = props;

    const {
        menu,
        orders
    } = useContext(DynamicDataContext);

    const MenuManagerRef = useRef();
    useLayoutEffect(() => {
        gsap.from(MenuManagerRef.current, animations.appearY);
        
        return () => {
            gsap.to(MenuManagerRef.current, animations.appearY);
        }
    }, []);
    
    const menuTypes = menu.get.map(menuItem => menuItem.type).filter((item, index, array) => (array.indexOf(item) === index));
    const [ itemInfo, setItemInfo ] = useState(null);
    const [ isBlurred, setIsBlurred ] = useState(false);

    function close() {
        setSelectedCustomer(null);
    }

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

    function handleItemInfo(item) {
        setItemInfo(item);
        item !== null ? 
            setIsBlurred(true) :
            setIsBlurred(false);
    }

    return (
        !!selectedCustomer &&
            <div className="MenuManager" ref={MenuManagerRef}>
                {isBlurred && <div className="blur" />} 

                {!!itemInfo && <Infobox item={itemInfo} handleItemInfo={handleItemInfo}/>}

                    <span className="menu-title">
                        <span className="customer-title">{selectedCustomer.name}</span>
                        <button className="close-button" onClick={(close)}>
                            <img src={closeIcon} alt="" />
                        </button>
                    </span>
                    
                    <div className="menu-container">

                        {menu.get.length === 0 ? "Loading..." :
                        menuTypes.map(menuType => (
                            <div className="type" key={uuid()}>
                                <div className="type-title cursive">{tools.capitalizeFirstLetter(menuType) + "s"}</div>

                                {menu.get.map(item => (
                                    menuType === item.type && 
                                        item.available !== 0 &&
                                            <div className="item-container" key={item.id}>
                                                <div className="item">
                                                    <span className="item-title">
                                                        <button className="item-info-button" onClick={() => {handleItemInfo(item)}}>
                                                            <img src={infoIcon} alt="" />
                                                        </button>

                                                        <span className="item-name">
                                                            {item.name}     
                                                        </span>
                                                    </span>

                                                    <nav className="item-nav">
                                                        <button className="progressive" onClick={() => {orders.add({
                                                            ...filterItem(item)
                                                        })}}>{item.price.toLocaleString("en-US")} gil</button>


                                                        <button className="constructive" onClick={() => {orders.add({
                                                            ...filterItem(item), 
                                                            price: 0
                                                        })}}>Free</button>
                                                    </nav>
                                                </div>

                                                <div className="item-info">
                                                    {item.id}
                                                </div>
                                            </div>
                                ))}
                            </div>
                        ))}
                    </div>
            </div>
    );
}