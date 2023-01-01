import React, { useState } from 'react';
import tools from '../tools';
import { SplitTab } from './SplitTab';
import { CombinedTab } from './CombinedTab';

import closeIcon from './../assets/icons/close.png';

export function TabManager(props) {

    const [isBlurred, setIsBlurred] = useState(false);

    const close = () => {
        props.handleViewTab(false);
    }


    const [ tabView, setTabView ] = useState('combined');

    return(
        <div className="TabManagerContainer">
            {isBlurred && <div className="blur"></div>}

            <section className="TabManager">

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
                            className={tabView === "combined" && "constructive"}
                            onClick={() => {setTabView('combined')}}>Combined
                        </button>
                        
                        <button 
                            className={tabView === "split" && "constructive"}
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
                    <button className="payButton constructive" onClick={() => {props.payOrders(props.deliveredOrdersInTable.map(order => order.id))}}>Pay & Archive</button>
                </nav>

            </section>
        </div>
    )
}