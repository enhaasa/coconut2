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

                    <span className="menuTitle">
                        <span className="customerTitle">{selectedCustomer.name}</span>
                        <button className="closeButton" onClick={(close)}>
                            <img src={closeIcon} alt="" />
                        </button>
                    </span>
                    
                    <div className="menuContainer">

                        {menu.get.length === 0 ? "Loading..." :
                        menuTypes.map(menuType => (
                            <div className="type" key={uuid()}>
                                <div className="typeTitle cursive">{tools.capitalizeFirstLetter(menuType) + "s"}</div>

                                {menu.get.map(item => (
                                    menuType === item.type && 
                                        item.available !== 0 &&
                                            <div className="itemContainer" key={item.id}>
                                                <div className="item">
                                                    <span className="itemTitle">
                                                        <button className="itemInfoButton" onClick={() => {handleItemInfo(item)}}>
                                                            <img src={infoIcon} alt="" />
                                                        </button>

                                                        <span className="itemName">
                                                            {item.name}     
                                                        </span>
                                                    </span>

                                                    <nav className="itemNav">
                                                        <button className="progressive" onClick={() => {orders.add({
                                                            ...filterItem(item)
                                                        })}}>{item.price.toLocaleString("en-US")} gil</button>


                                                        <button className="constructive" onClick={() => {orders.add({
                                                            ...filterItem(item), 
                                                            price: 0
                                                        })}}>Free</button>
                                                    </nav>
                                                </div>

                                                <div className="itemInfo">
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