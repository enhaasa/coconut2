import React, { useState, useContext } from 'react';

//Components
import Dropdown from "../common/Dropdown/Dropdown";
import DropdownItem from "../common/Dropdown/DropdownItem";
import Button from '../common/Button/Button';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Tools
import uuid from 'react-uuid';

export default function AddSectionPointerModal({ setModal, section }) {

    const {
        sections,
        sectionPointers,
    } = useContext(DynamicDataContext);

    function getSectionByID(ID) {
        return sections.get.find(section => section.id === ID);
    }

    const [ selectedType, setSelectedType ] = useState('bar');
    const [ selectedTargetSection, setSelectedTargetSection ] = useState(section);

    function handleTargetSection(target) {
        setSelectedTargetSection(getSectionByID(parseInt(target.value)));
    }

    function handleSelectedType(type) {
        setSelectedType(type);
    }

    function handleSubmit() {

        //if (!selectedType) return;
        //if (!selectedTargetSection) return;

        const sectionPointer = {
            section_id: section.id,
            target_section_id: selectedTargetSection.id,
            type: selectedType,
        };

        sectionPointers.add(sectionPointer)
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
                <Button type='neutral' clickEvent={() => setModal(null)}>Cancel</Button>
                <Button type='constructive' clickEvent={handleSubmit}>Create</Button>
            </div>
        </div>
    )
}