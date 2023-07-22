import React, { useState, useLayoutEffect, useRef, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
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
        deliveredOrdersInSeating,
        customersInSeating,
        seating,
        overriddenSession,
    } = props;

    const {
        customers,
        seatings,
        orders,
    } = useContext(DynamicDataContext);

    const [ isBlurred, setIsBlurred ] = useState(false);
    const [ tabView, setTabView ] = useState('combined');
    const [ session, setSession ] = useState(overriddenSession !== undefined ? overriddenSession : seating.session);


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
                orders.pay(ordersToPay, seating);
                closeConfirmBox();     
            },
            closeConfirmBox: function(){
                closeConfirmBox();
            },
            title: "Are you sure?",
            message: `Paying the orders will also delete them from this list.`
        });
    }



    return(
        <div className="TabManagerContainer" ref={TabManagerRef}>
            <section className="TabManager">
                {isBlurred && <div className="blur"></div>}

                <header>
                    <span className="title cursive">Tab</span>
                    <button className="close-button" onClick={close}>
                        <img src={closeIcon} alt="" />
                    </button>
                </header>

                <nav className="view-nav">
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

                <div className="tab-list">
                    {tabView === 'split' &&
                        <SplitTab 
                            deliveredOrdersInSeating={deliveredOrdersInSeating}
                            customersInSeating={customersInSeating}
                            orders={orders}
                        />
                    }
                        
                    {tabView === 'combined' &&
                        <CombinedTab
                            deliveredOrdersInSeating={deliveredOrdersInSeating}
                        />
                    }
                </div>

                <nav className="tab-nav">
                    <span className="receipt">
                        {session !== null ?
                        <a href={`https://cocosoasis.info/r.html?id=${session}`}
                        target="_blank" rel="noopener noreferrer">{`Receipt Link`}</a> :
                        <span className="noresult">No Receipt Available</span>}
                    </span>

                    <button 
                    className={`pay-button ${deliveredOrdersInSeating.map(order => order).length === 0 ? "inactive" : "constructive"}`}
                    disabled={deliveredOrdersInSeating.map(order => order).length === 0}
                    onClick={() => {confirmPayOrders(deliveredOrdersInSeating)}}>Pay & Archive</button>
                </nav>

                {session !== null &&
                    <div className="receipt-RP">
                        <textarea 
                            value={`/em hands over the tab: cocosoasis.info/r.html?id=${session}`} 
                            readOnly
                        />
                    </div>
                }

            </section>
        </div>
    )
}