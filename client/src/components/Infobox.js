import React, { useLayoutEffect, useRef} from 'react';
import closeIcon from './../assets/icons/close.png';
import gsap from 'gsap';
import animations from '../animations';

export default function Infobox(props) {
    const { item, handleItemInfo } = props;

    const InfoBoxRef = useRef();
    useLayoutEffect(() => {
        gsap.from(InfoBoxRef.current, animations.softElastic);

        return () => {
            gsap.to(InfoBoxRef.current, animations.softElastic);
        }
    }, []);

    return (
        <div className="InfoboxContainer" ref={InfoBoxRef}>
            <div className="Infobox">
                <div className="infoTitle">
                    {!!item.name && item.name}
                    <button className="closeButton" onClick={() => handleItemInfo(null)}>
                        <img src={closeIcon} />
                    </button>
                </div>

                <div className="infoContainer">

                    <div className="section item">
                        <span className="sectionHeader cursive">Item</span>
                        <p>
                            {!!item.item ? 
                                item.item :
                                <span className="noresult">This item has no documented item.</span>}  
                        </p>
                    </div>

                    <div className="divider"></div>

                    <div className="section description">
                        <span className="sectionHeader cursive">Description</span>
                        <p>
                            {!!item.description ? 
                                item.description :
                                <span className="noresult">This item has no documented description.</span>}  
                        </p>
                    </div>

                    <div className="divider"></div>

                    <div className="section ingredients">
                        <span className="sectionHeader cursive">Ingredients</span>
                        <p>
                            {!!item.ingredients ? 
                                item.ingredients.join(", ") :
                                <span className="noresult">This item has no documented ingredients.</span>}  
                        </p>
                    </div>

                    <div className="divider"></div>

                    <div className="section pairing">
                        <span className="sectionHeader cursive">Pairings</span>
                        <p>
                            {!!item.pairings ? 
                                item.pairings :
                                <span className="noresult">This item has no documented pairings.</span>}  
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}