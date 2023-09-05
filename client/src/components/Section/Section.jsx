import React, { useState, useRef, useContext, useEffect } from 'react';

//Tools
import uuid from 'react-uuid';

//Hooks
import usePixelClick from '../../api/usePixelClick';

//Components
import Seating from '../Seating/Seating';
import SectionPointer from '../SectionPointer/SectionPointer';
import Modal from '../common/Modal/Modal';
import AddSeatingModal from '../Seating/_AddSeatingModal';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';

//Images
import overlay from './../../assets/icons/dark-fabric.png';
import AddSectionPointerModal from '../SectionPointer/_AddSectionPointerModal';

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
        itemInMovement,
        setItemInMovement,
        setSelectedSeating,
        selectedSection,
        selectedSeating,
        handleContextMenu,
        isDangerousSettings,
    } = useContext(ControlStatesContext);

    const [ modal, setModal ] = useState(null);
    const [ isBlurred, setIsBlurred ] = useState(false);
    useEffect(() => {
        if (selectedSeating || modal) {
            setIsBlurred(true);
        } else {
            setIsBlurred(false);
        }
    }, [selectedSeating, modal]);

    const parsedSection = dataTree[selectedSection];
    const section = sections.get[selectedSection];

    const contextMenuTitle = 'Create New';
    const contextMenuOptions = [
        {
            name: 'Table',
            clickEvent: () => setModal(
                <Modal closeButtonEvent={() => setModal(null)} title='Create New Table'>
                    <AddSeatingModal setModal={setModal} />
                </Modal>
            )
        }, {
            name: 'Section Pointer',
            clickEvent: () => setModal(
                <Modal closeButtonEvent={() => setModal(null)} title='Create New Section Pointer'>
                    <AddSectionPointerModal setModal={setModal} section={section}/>
                </Modal>
            )
        }
    ];

    const getVectorPoint = usePixelClick();

    function handleMoveItem(event) {
        if (!itemInMovement) return; 
        if (itemInMovement.type === 'section pointer' || itemInMovement.type === 'seating') {
            const { moveFunction } = itemInMovement;
            const [ x, y ] = getVectorPoint(event);

            const newLocation = {
                pos_x: x,
                pos_y: y,
                section_id: section.id
            }

            moveFunction(itemInMovement.item, newLocation);
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
        <>
            <div 
                className={`Section ${itemInMovement && 'moving-item-mode'}`} 
                onClick={handleMoveItem} 
                ref={SectionRef}
                onContextMenu={(event) => handleContextMenu(event, contextMenuOptions, contextMenuTitle)}
                >
                
                {modal && modal}

                {
                    itemInMovement &&
                    <div className='moving-item-mode-info'>
                        {`Moving ${itemInMovement.type}. Press ESC to cancel.`}
                    </div>
                }

                {isBlurred && <div className='blur'></div>}
                
                <img className='overlay' src={overlay} alt='' />
                {parsedSection.image_url && <img className='section-image' src={parsedSection.image_url} alt='' />}

                {
                    parsedSection.seatings.map((seating) => (
                        <Seating 
                            seating={seating}
                            colorset={colorset} 
                            setSelectedSeating={setSelectedSeating}
                            key={seating.id}
                        />
                    )) 
                }

                {
                    sectionPointers.get.map(sectionPointer => (
                        sectionPointer.section_id === section.id &&
                        <SectionPointer 
                            key={uuid()} 
                            sectionPointer={sectionPointer}
                            setModal={setModal}    
                        />
                    ))
                }
            
            </div>
        </>
    );
}