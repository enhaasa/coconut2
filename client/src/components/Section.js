import React, { useRef, useContext, useEffect } from 'react';

//Tools
import uuid from 'react-uuid';

//Hooks
import usePixelClick from '../api/usePixelClick';

//Components
import Seating from './Seating';
import SectionPointer from './SectionPointer';

//Contexts
import { DynamicDataContext } from '../api/DynamicData';
import { ControlStatesContext } from '../api/ControlStates';

//Images
import overlay from './../assets/icons/dark-fabric.png';

export default function Section(props) {
    const {
        colorset,
    } = props;

    const {
        seatings,
        dataTree,
        sections,
        sectionPointers,
    } = useContext(DynamicDataContext);
    
    const {
        maxDeliveryTime, 
        itemInMovement,
        setItemInMovement,
        setSelectedSeating,
        selectedSection,
    } = useContext(ControlStatesContext);

    const parsedSection = dataTree[selectedSection];
    const section = sections.get[selectedSection];

    const getVectorPoint = usePixelClick();

    function handleMoveItem(event) {
        if (itemInMovement) {

            const { moveFunction } = itemInMovement;
            
            const [ x, y ] = getVectorPoint(event);

            const newLocation = {
                pos_x: x,
                pos_y: y,
                section_id: section.id
            }

            moveFunction(itemInMovement, newLocation);
            setItemInMovement(null);
            
        }
    }

    const handleEscapeKeyPress = (event) => {
        if (event.key === 'Escape') {

          setItemInMovement(null);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscapeKeyPress);
    
        return () => {
          document.removeEventListener('keydown', handleEscapeKeyPress);
        };
    }, []);

    const SectionRef = useRef();
    let seatingsInSection = [];

    seatings.get.forEach((seating, index) => {
        if (seating.section_name === section.name)
            seatingsInSection.push({
                ...seating, index: index
            })
    });

    return (
            <div className={`Section ${itemInMovement && 'moving-item-mode'}`} onClick={handleMoveItem} ref={SectionRef} >  
                {
                    itemInMovement &&
                    <div className='moving-item-mode-info'>
                        Moving item. Press ESC to cancel.
                    </div>
                }

                <img className='overlay' src={overlay} alt='' />
                {parsedSection.image_url && <img className='section-image' src={parsedSection.image_url} alt='' />}

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

                {
                    sectionPointers.get.map(sectionPointer => (
                        sectionPointer.section_id === section.id &&
                        <SectionPointer key={uuid()} sectionPointer={sectionPointer}/>
                    ))
                }
            
            </div>
    );
}