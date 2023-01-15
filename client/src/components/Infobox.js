import React, { useLayoutEffect, useRef} from 'react';
import closeIcon from './../assets/icons/close.png';
import gsap from 'gsap';
import animations from '../animations';

export function Infobox(props) {

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
                    {!!props.item.name && props.item.name}
                    <button className="closeButton" onClick={() => props.handleItemInfo(null)}>
                        <img src={closeIcon} />
                    </button>
                </div>

                <div className="infoContainer">
                    <div className=" section description">
                    <span className="sectionHeader cursive">Description</span>
                        <p className="quote">
                            {!!props.item.description ? 
                                props.item.description :
                                <span className="noresult">This item has no documented description.</span>}  
                        </p>
                    </div>

                    <div className="section ingredients">
                    <span className="sectionHeader cursive">Ingredients</span>
                        <p>
                            {!!props.item.ingredients ? 
                                props.item.ingredients.join(", ") :
                                <span className="noresult">This item has no documented ingredients.</span>}  
                        </p>
                    </div>

                    <div className="section pairing">
                        <span className="sectionHeader cursive">Pairings</span>
                        <p>
                            {!!props.item.pairings ? 
                                props.item.pairings :
                                <span className="noresult">This item has no documented pairings.</span>}  
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}