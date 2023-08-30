import React, { useState, useLayoutEffect, useRef, useContext } from 'react';

//Contexts
import { ControlStatesContext } from '../../api/ControlStates';

//Components
import MenuInfoModal from './MenuInfoModal';
import CloseButton from '../common/CloseButton/CloseButton';
import DiningItems from './DiningItems';
import ServiceItems from './ServiceItems';
import MultiToggle from '../common/MultiToggle/MultiToggle';
import MultiToggleOption from '../common/MultiToggle/MultiToggleOption';

//Animations
import gsap from 'gsap';
import animations from '../../animations';

export default function MenuManager(props) {
    const {
        closeButtonEvent,
    } = props;

    const { 
        selectedCustomer,
    } = useContext(ControlStatesContext);

    const options = [
        ['Dining', <DiningItems handleModal={handleModal} />],
        ['Services', <ServiceItems handleModal={handleModal} />]
    ];

    const MenuManagerRef = useRef();
    useLayoutEffect(() => {
        gsap.from(MenuManagerRef.current, animations.appearY);
        
        return () => {
            gsap.to(MenuManagerRef.current, animations.appearY);
        }
    }, []);
    
    const [ modal, setModal ] = useState(null);
    const [ isBlurred, setIsBlurred ] = useState(false);
    const [ selectedOption, setSelectedOption ] = useState(0);

    function handleModal(item) {
        setModal(item);
        item !== null ? 
            setIsBlurred(true) :
            setIsBlurred(false);
    }

    return (
        <div className='MenuManager' ref={MenuManagerRef}>
            {isBlurred && <div className='blur' />} 

            {!!modal && modal}
                <span className='menu-title'>
                    <CloseButton clickEvent={closeButtonEvent} />
                    <div className='menu-nav'>
                        <MultiToggle>
                            {options.map((option, index) => (
                                <MultiToggleOption
                                    clickEvent={() => setSelectedOption(index)}
                                    isActive={selectedOption === index ? true : false}
                                >
                                {option[0]}
                                </MultiToggleOption>
                            ))}
                        </MultiToggle>
                    </div>
                </span>
                
                {selectedCustomer && 
                    <span className='customer-title'>Adding to {selectedCustomer.name}...</span>   
                }

                <div className='menu-container'>
                    {options[selectedOption][1]}
                </div>
        </div>
    );
}