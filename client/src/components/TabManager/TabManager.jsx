import React, { useState, useLayoutEffect, useRef, useContext } from 'react';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Components
import SplitTab from './_SplitTab';
import CombinedTab from './_CombinedTab';
import Button from '../common/Button/Button';
import CloseButton from '../common/CloseButton/CloseButton';
import MultiToggle from '../common/MultiToggle/MultiToggle';
import MultiToggleOption from '../common/MultiToggle/MultiToggleOption';

//Animations
import gsap from 'gsap';
import animations from '../../animations';

//Tools
import { formatStringAsPrice } from '../../utils';

export default function TabManager(props) {
    const { 
        handleViewTab, 
        setConfirmBox,
        deliveredOrdersInSeating,
        customersInSeating,
        seating,
        overriddenSession,
        ordersTotal,
        servicesTotal,
        completedServices,
    } = props;

    const {
        orders,
    } = useContext(DynamicDataContext);

    const [ isBlurred, setIsBlurred ] = useState(false);
    const [ tabView, setTabView ] = useState('combined');
    const [ session, setSession ] = useState(overriddenSession !== undefined 
        ? overriddenSession 
        : seating.session
    );

    const TabManagerRef = useRef();
    useLayoutEffect(() => {
        gsap.from(TabManagerRef.current, animations.softElastic);

        return () => {
            gsap.to(TabManagerRef.current, animations.softElastic);
        }
    }, []);

    function handleClose(){
        gsap.to(TabManagerRef.current, animations.fadeFall);

        setTimeout(()=> {
            handleViewTab(false);
        }, 100)
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
            pendingRequestEvent: {
                args: [ordersToPay, seating],
                event: orders.pay
            },
            
            closeConfirmBox: function(){
                closeConfirmBox();
            },
            title: 'Are you sure?',
            message: `Paying the orders will also delete them from this list.`
        });
    }

    return (
        <div className='TabManagerContainer' ref={TabManagerRef}>
            <section className='TabManager'>
                {isBlurred && <div className='blur'></div>}

                <header>
                    <MultiToggle>
                        <MultiToggleOption 
                            clickEvent={() => setTabView('combined')}
                            isActive={tabView === 'combined' ? true : false}>
                            Combined
                        </MultiToggleOption>

                        <MultiToggleOption 
                            clickEvent={() => setTabView('split')}
                            isActive={tabView === 'split' ? true : false}>
                            Split
                        </MultiToggleOption>
                    </MultiToggle>
                    <CloseButton clickEvent={handleClose}/>
                </header>

                <div className='tab-list'>
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
                            completedServices={completedServices}
                        />
                    }
                </div>

                <div className='tab-summary'>
                    <div className='row'>
                        <span>Orders:</span>
                        <span>{`${formatStringAsPrice(ordersTotal.toString())} gil`}</span>
                    </div>

                    <div className='row'>
                        <span>Services:</span>
                        <span>{`${formatStringAsPrice(servicesTotal.toString())} gil`}</span>
                    </div>

                    <div className='row total'>
                        <span>Total:</span>
                        <span>{`${formatStringAsPrice(`${ordersTotal + servicesTotal}`)} gil`}</span>  
                    </div>
                </div>

                <nav className='tab-nav'>
                    <span className='receipt-link'>
                        {session !== null ?
                        <a href={`https://cocosoasis.info/r.html?id=${session}`}
                        target='_blank' rel='noopener noreferrer'>{`Receipt Link`}</a> :
                        <span className='noresult'>No Receipt Available</span>}
                    </span>

                    <Button 
                        type={`${deliveredOrdersInSeating.map(order => order).length === 0 ? 'inactive' : 'constructive'}`}
                        disabled={deliveredOrdersInSeating.map(order => order).length === 0}
                        clickEvent={() => {confirmPayOrders(deliveredOrdersInSeating)}}
                    >
                        Pay & Archive
                    </Button>
                </nav>

                {session !== null &&
                    <div className='receipt-RP'>
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