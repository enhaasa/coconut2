import React, { useState, useContext } from 'react';

//Components
import Dropdown from "../common/Dropdown/Dropdown";
import DropdownItem from "../common/Dropdown/DropdownItem";
import Button from '../common/Button/Button';
import MultiToggle from '../common/MultiToggle/MultiToggle';
import MultiToggleOption from '../common/MultiToggle/MultiToggleOption';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Tools
import uuid from 'react-uuid';

//Icons
import barIcon from '../../assets/icons/drinks-medium-white.png';
import seatingIcon from '../../assets/icons/chairs-medium-white.png';

export default function EditSectionPointerModal({setModal, sectionPointer}) {

    const {
        sections,
        sectionPointers,
    } = useContext(DynamicDataContext);

    function getSectionByID(ID) {
        return sections.get.find(section => section.id === ID);
    }

    const [ selectedType, setSelectedType ] = useState(sectionPointer.type);
    const [ selectedTargetSection, setSelectedTargetSection ] = useState(getSectionByID(sectionPointer.target_section_id));

    function handleTargetSection(target) {
        setSelectedTargetSection(getSectionByID(parseInt(target.value)));
    }

    function handleSelectedType(type) {
        setSelectedType(type);
    }

    function getAttributesToChange() {
        let attributes = [];

        if (selectedType !== sectionPointer.type) {
            attributes.push(['type', selectedType]);
        }

        if (selectedTargetSection.id !== sectionPointer.target_section_id) {
            attributes.push(['target_section_id', selectedTargetSection.id]);
        }

        return attributes;
    }

    return (
        <div className='EditSectionPointerModal'>
            <div className='row'>
                <span className='label'>Target</span>
                <span className='selector'>
                    <Dropdown
                        value = {selectedTargetSection.id}
                        onChangeEvent = {({target}) => {handleTargetSection(target)}}
                        >
                        {sections.get.map(section => (
                            <DropdownItem key={uuid()} value={section.id}>
                                {section.name}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </span>
            </div>

            <div className='row'>
                <span className='label'>Icon</span>
                <span className='selector'>
                    <MultiToggle>
                        <MultiToggleOption 
                            clickEvent={() => handleSelectedType('bar')}
                            isActive={selectedType === 'bar' ? true : false}>
                            <img src={barIcon} alt='Bar Icon'/>
                        </MultiToggleOption>

                        <MultiToggleOption 
                            clickEvent={() => handleSelectedType('seating')}
                            isActive={selectedType === 'seating' ? true : false}>
                            <img src={seatingIcon} alt='Seating Icon'/>
                        </MultiToggleOption>
                    </MultiToggle>
                </span>
            </div>

            <div className='row bottom-nav'>
                <Button 
                    type='destructive' 
                    pendingResponseClickEvent={{
                        args: [sectionPointer],
                        event: sectionPointers.remove
                    }}
                    postEventCallback={() => setModal(null)}
                >Delete</Button>


                <Button 
                    type='constructive' 
                    pendingResponseClickEvent={{
                        args: [sectionPointer, getAttributesToChange()],
                        event: sectionPointers.setAttributes
                    }}
                    postEventCallback={() => setModal(null)}
                >Save</Button>
            </div>
        </div>
    )
}