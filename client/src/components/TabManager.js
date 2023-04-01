import React, { useState, useLayoutEffect, useRef } from 'react';
import tools from '../tools';
import SplitTab from './SplitTab';
import CombinedTab from './CombinedTab';
import closeIcon from './../assets/icons/close.png';
import gsap from 'gsap';
import animations from '../animations';
import { nanoid } from 'nanoid';

export default function TabManager(props) {
    const { 
        handleViewTab, 
        setConfirmBox,
        deliveredOrdersInTable,
        customersInTable,
        table,
        tables,
        orders,
    } = props;

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
        handleViewTab(false);
    }

    function openConfirmBox(data) {
        setConfirmBox(data);
        setIsBlurred(true);
    }

    function closeConfirmBox() {
        setConfirmBox(null);
        setIsBlurred(false);
    };

    function confirmPayOrders(ordersToPay) {
        setIsBlurred(true);
        openConfirmBox({
            callback: function(){
                const session = nanoid(5);
                const tableNumber = ordersToPay[0].table;

                orders.payAll(ordersToPay, tableNumber, session);
                tables.set(prev => {
                    prev[tableNumber].session = session;
                    return [...prev];
                });
                
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
                            deliveredOrdersInTable={deliveredOrdersInTable}
                            customersInTable={customersInTable}
                            orders={orders}
                        />
                    }
                        
                    {tabView === 'combined' &&
                        <CombinedTab
                            deliveredOrdersInTable={deliveredOrdersInTable}
                            customersInTable={customersInTable}
                        />
                    }
                </div>

                <nav className="tabNav">
                    <span className="receipt">
                        {table.session !== null ?
                        <a href={`https://cocosoasis.info/r.php?id=${table.session}`}
                        target="_blank" rel="noopener noreferrer">{`Receipt Link`}</a> :
                        <span className="noresult">No Receipt Available</span>}
                    </span>

                    <button 
                    className={`payButton ${deliveredOrdersInTable.map(order => order).length === 0 ? "inactive" : "constructive"}`}
                    disabled={deliveredOrdersInTable.map(order => order).length === 0}
                    onClick={() => {confirmPayOrders(deliveredOrdersInTable.map(order => order))}}>Pay & Archive</button>
                </nav>

                {table.session !== null &&
                    <div className="receiptRP">
                        <textarea 
                            defaultValue={`/em hands over the tab: cocosoasis.info/r.php?id=${table.session}`} 
                        />
                    </div>
                }

            </section>
        </div>
    )
}