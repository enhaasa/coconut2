import React, { useState, useContext } from 'react';

//Contexts
import { ControlStatesContext } from "../../api/ControlStates";
import { DynamicDataContext } from '../../api/DynamicData';
import EditSectionPointerModal from './EditSectionPointerModal';

//Icons
import barIcon from './../../assets/icons/drinks-white.png';

export default function SectionPointer(props) {
    const {
        sectionPointer,
        setModal,
    } = props;

    const {
        sections,
        sectionPointers
    } = useContext(DynamicDataContext);

    const {
        setItemInMovement,
        setSelectedSection,
        handleContextMenu,
        itemInMovement,
    } = useContext(ControlStatesContext);

    const types = [
        {
            name: 'bar',
            icon: barIcon
        }
    ]

    const isMoving = itemInMovement && itemInMovement.id === sectionPointer.id;
    const icon = types.find(t => t.name === sectionPointer.type).icon;

    function handleMoveSectionPointer() {
        setItemInMovement({...sectionPointer, moveFunction: sectionPointers.setLocation});
    }

    const contextMenuTitle = `Section pointer for: ${sectionPointer.name}`;
    const contextMenuOptions = [
        {
            name: 'Move',
            clickEvent: handleMoveSectionPointer
        }, {
            name: 'Edit',
            clickEvent: () => setModal(<EditSectionPointerModal />)
        },
    ];

    function handleClick() {
        const index = sections.get.findIndex(s => s.id === sectionPointer.target_section_id);
        setSelectedSection(index);
    }

    return (
        <>
            <button 
                className={`SectionPointer ${isMoving && 'transparent ghost'}`}
                onClick={handleClick}
                onContextMenu={(event) => {handleContextMenu(event, contextMenuOptions, contextMenuTitle)}}
                style={{
                    left: sectionPointer.pos_x, 
                    top: sectionPointer.pos_y 
                }}>
                <img src={icon} alt='Section Pointer Icon' />
            </button>
        </>
    )
}