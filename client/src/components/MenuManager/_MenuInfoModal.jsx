import React, { useLayoutEffect, useRef} from 'react';

//Components
import CloseButton from '../common/CloseButton/CloseButton';

//Animations
import gsap from 'gsap';
import animations from '../../animations';

export default function MenuInfoModal(props) {
    const { item, handleModal } = props;

    const InfoBoxRef = useRef();
    useLayoutEffect(() => {
        gsap.from(InfoBoxRef.current, animations.softElastic);

        return () => {
            gsap.to(InfoBoxRef.current, animations.softElastic);
        }
    }, []);

    function breaklineOnEm(text) {
        const array = text.split('/em');
        return array.slice(1);
    }
    
    return (
        <div className='MenuModalContainer' ref={InfoBoxRef}>
            <div className='MenuModal'>
                <div className='info-title'>
                    {!!item.name && item.name}
                    <CloseButton clickEvent={() => handleModal(null)}  />
                </div>

                <div className='info-container'>

                    <div className='section item'>
                        <span className='section-header cursive'>Item</span>
                        <p>
                            {!!item.item 
                            ? item.item 
                            : <span className='noresult'>This item has no documented item.</span>}  
                        </p>
                    </div>

                    <div className='divider'></div>

                    <div className='section description'>
                        <span className='section-header cursive'>Description</span>
                        <p>
                            {!!item.description 
                                ? item.description 
                                : <span className='noresult'>This item has no documented description.</span>}  
                        </p>
                    </div>

                    <div className='divider'></div>

                    <div className='section ingredients'>
                        <span className='section-header cursive'>Ingredients</span>
                        <p>
                            {!!item.ingredients 
                            ? item.ingredients.replaceAll(',', ', ') 
                            : <span className='noresult'>This item has no documented ingredients.</span>}  
                        </p>
                    </div>

                    <div className='divider'></div>

                    <div className='section pairing'>
                        <span className='section-header cursive'>Pairings</span>
                        <p>
                            {!!item.pairings 
                            ? item.pairings 
                            : <span className='noresult'>This item has no documented pairings.</span>}  
                        </p>
                    </div>

                    <div className='section RPcreation'>
                        <span className='section-header cursive'>RP Creation</span>
                        <p>
                            {!!item.RPcreation 
                            ? breaklineOnEm(item.RPcreation).map(line => <div>{`/em ${line}`}<br /><br /></div>) 
                            : <span className='noresult'>This item has no documented RP for creation.</span>}  
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}