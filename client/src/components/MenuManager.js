import React, { useState } from 'react';
import { Infobox } from './Infobox';
import tools from '../tools';

import closeIcon from './../assets/icons/close.png';
import infoIcon from './../assets/icons/info-small-white.png';

export function MenuManager(props) {
    
    const menuTypes = props.menu.map(menuItem => (menuItem.type)).filter((item, index, array) => (array.indexOf(item) === index));
    const [ itemInfo, setItemInfo ] = useState(null);
    const [ isBlurred, setIsBlurred ] = useState(false);

    const close = () => {
        props.setSelectedCustomer(null);
    }

    const handleItemInfo = (item) => {
        setItemInfo(item);
        item !== null ? 
            setIsBlurred(true) :
            setIsBlurred(false);
    }

    return (
        !!props.selectedCustomer &&
            <div className="MenuManager">
                {isBlurred && <div className="blur" />} 

                {!!itemInfo && <Infobox item={itemInfo} handleItemInfo={handleItemInfo}/>}

                    <span className="menuTitle">
                        <span className="customerTitle">{props.selectedCustomer.name}</span>
                        <button className="closeButton" onClick={(close)}>
                            <img src={closeIcon} alt="" />
                        </button>
                    </span>
                    
                    <div className="menuContainer">

                        {props.menu.length === 0 ? "Loading..." :
                        menuTypes.map(menuType => (
                            <div className="type">
                                <div className="typeTitle cursive">{tools.capitalizeFirstLetter(menuType) + "s"}</div>

                                {props.menu.map(item => (
                                    menuType === item.type && 
                                        <div className="itemContainer">
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
                                                    <button className="progressive" onClick={() => {props.addOrder({
                                                        ...item, 
                                                        customer: props.selectedCustomer.id, 
                                                        floor: props.selectedCustomer.floor, 
                                                        delivered: false,
                                                        paid: false,
                                                        time: tools.getCurrentTime()
                                                    })}}>{item.price} gil</button>

                                                    <button className="constructive" onClick={() => {props.addOrder({
                                                        ...item, 
                                                        customer: props.selectedCustomer.id, 
                                                        floor: props.selectedCustomer.floor, 
                                                        price: 0, 
                                                        delivered: false,
                                                        paid: false,
                                                        time: tools.getCurrentTime(),
                                                        Id: item.ID + "0"
                                                    })}}>Free</button>
                                                </nav>
                                            </div>

                                            <div className="itemInfo">
                                                {item.ID}
                                            </div>
                                        </div>
                                ))}
                            </div>
                        ))}
                    </div>
            </div>
    );
}