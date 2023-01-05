import React, { useState } from 'react';
import tools from '../tools';
import { SplitTab } from './SplitTab';
import { CombinedTab } from './CombinedTab';
import { ConfirmBox } from './ConfirmBox';
import closeIcon from './../assets/icons/close.png';

export function TabManager(props) {

    const [ isBlurred, setIsBlurred ] = useState(false);
    const [ tabView, setTabView ] = useState('combined');

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
                props.payOrders(orders);
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
        <div className="TabManagerContainer">
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
                    <button className="receiptButton inactive transparent disabled">Generate Receipt</button>
                    <button className="payButton constructive" onClick={() => {confirmPayOrders(props.deliveredOrdersInTable.map(order => order.id))}}>Pay & Archive</button>
                </nav>

            </section>
        </div>
    )
}