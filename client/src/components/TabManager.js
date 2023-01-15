import React, { useState, useLayoutEffect, useRef } from 'react';
import tools from '../tools';
import { SplitTab } from './SplitTab';
import { CombinedTab } from './CombinedTab';
import { ConfirmBox } from './ConfirmBox';
import closeIcon from './../assets/icons/close.png';
import gsap from 'gsap';
import animations from '../animations';

export function TabManager(props) {

    const [ isBlurred, setIsBlurred ] = useState(false);
    const [ tabView, setTabView ] = useState('combined');

    const TabManagerRef = useRef();
    useLayoutEffect(() => {
        gsap.from(TabManagerRef.current, animations.softElastic);

        return () => {
            gsap.to(TabManagerRef.current, animations.softElastic);
        }
    }, []);

    function close() {
        props.handleViewTab(false);
    }

    function openConfirmBox(data) {
        props.setConfirmBox(data);
        setIsBlurred(true);
    }

    function closeConfirmBox() {
        props.setConfirmBox(null);
        setIsBlurred(false);
    };

    function confirmPayOrders(orders) {
        setIsBlurred(true);
        openConfirmBox({
            callback: function(){
                props.payOrders(orders, orders[0].table);
                closeConfirmBox();
            },
            closeConfirmBox: function(){
                closeConfirmBox()
            },
            title: "Are you sure?",
            message: `Paying the orders will also delete them from this list.`
        })
    }

    return(
        <div className="TabManagerContainer" ref={TabManagerRef}>
            <section className="TabManager">
                {isBlurred && <div className="blur"></div>}

                <header>
                    <span className="title cursive">Tab</span>
                    <button className="closeButton" onClick={close}>
                        <img src={closeIcon} alt="" />
                    </button>
                </header>

                <nav className="viewNav">
                    <span className="section">
                        <label>View:</label>
                    </span>

                    <span className="section">
                        <button 
                            className={tabView === "combined" ? "constructive" : ""}
                            onClick={() => {setTabView('combined')}}>Combined
                        </button>
                        
                        <button 
                            className={tabView === "split" ? "constructive" : ""}
                            onClick={() => {setTabView('split')}}>Split
                        </button>

                    </span>
                </nav>

                <div className="tabList">
                    {tabView === 'split' &&
                        <SplitTab 
                            deliveredOrdersInTable={props.deliveredOrdersInTable}
                            customersInTable={props.customersInTable}
                            removeOrder={props.removeOrder}
                            addOrder={props.addOrder}
                        />
                    }
                        
                    {tabView === 'combined' &&
                        <CombinedTab
                            deliveredOrdersInTable={props.deliveredOrdersInTable}
                            customersInTable={props.customersInTable}
                        />
                    }
                </div>

                <nav className="tabNav">
                    <span className="receipt">
                        {props.table.session !== null ?
                        <a href={`https://cocosoasis.info/r.php?id=${props.table.session}`}>{`Receipt Link`}</a> :
                        <span className="noresult">No Receipt Available</span>}
                    </span>

                    <button 
                    className={`payButton ${props.deliveredOrdersInTable.map(order => order).length === 0 ? "inactive" : "constructive"}`}
                    disabled={props.deliveredOrdersInTable.map(order => order).length === 0}
                    onClick={() => {confirmPayOrders(props.deliveredOrdersInTable.map(order => order))}}>Pay & Archive</button>
                </nav>

                {props.table.session !== null &&
                    <div className="receiptRP">
                        <textarea 
                            defaultValue={`/em hands over the tab: cocosoasis.info/r.php?id=${props.table.session}`} 
                        />
                    </div>
                }

            </section>
        </div>
    )
}