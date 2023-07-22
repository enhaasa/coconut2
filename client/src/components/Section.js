import React, { useLayoutEffect, useRef, useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import Seating from './Seating';
import gsap from 'gsap';
import animations from '../animations';

import overlay from './../assets/icons/dark-fabric.png';

export default function Section(props) {
    const {
        section,
        maxDeliveryTime, 
        colorset,
        setSelectedSeating,
        parsedSection
    } = props;

    const {
        seatings,
    } = useContext(DynamicDataContext);

    const SectionRef = useRef();

    let seatingsInSection = [];

    seatings.get.forEach((seating, index) => {
        if (seating.section_name === section.name)
            seatingsInSection.push({
                ...seating, index: index
            })
    });

    return (

       
            <div className="Section" ref={SectionRef}>
           
                <img className="overlay" src={overlay} alt="" />
                {parsedSection.image_url && <img className="section-image" src={parsedSection.image_url} alt="" />}

                {parsedSection.seatings.map((seating) => (
                        <Seating 
                            seating={seating}
                            maxDeliveryTime={maxDeliveryTime}
                            colorset={colorset} 
                            setSelectedSeating={setSelectedSeating}
                            key={seating.id}
                        />
                    )) 
                }
            
            </div>
        
    );
}