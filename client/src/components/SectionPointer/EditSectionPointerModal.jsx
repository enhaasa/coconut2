import React, { useState, useContext } from 'react';

//Components
import Dropdown from "../common/Dropdown/Dropdown";
import DropdownItem from "../common/Dropdown/DropdownItem";
import Button from '../common/Button/Button';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Tools
import uuid from 'react-uuid';

export default function EditSectionPointerModal({setModal, sectionPointer}) {

    const {
        sections,
        sectionPointers
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

    function handleRemove() {
        sectionPointers.remove(sectionPointer);
        setModal(null);
    }

    function handleSubmit() {
        if (selectedType !== sectionPointer.type) {
            sectionPointers.setAttribute(sectionPointer, 'type', selectedType);
        }

        if (selectedTargetSection !== sectionPointer.target_section_id) {
            sectionPointers.setAttribute(sectionPointer, 'target_section_id', selectedTargetSection.id);
        }

        setModal(null);
    }

    return (
        <div className='EditSectionPointerModal'>
            <div className='row'>
                <span className='label'>Icon</span>
                <span className='selector'>
                    <Dropdown
                        onChangeEvent = {({target}) => {handleSelectedType(target.value)}}
                        value = {selectedType}
                        >
                        <DropdownItem value={'bar'}>Bar</DropdownItem>
                        <DropdownItem value={'seating'}>Seating</DropdownItem>
                    </Dropdown>
                </span>
            </div>
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
            <div className='row bottom-nav'>
                <Button type='destructive' clickEvent={handleRemove}>Delete</Button>
                <Button type='constructive' clickEvent={handleSubmit} >Save</Button>
            </div>
        </div>
    )
}