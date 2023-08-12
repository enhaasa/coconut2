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

    function getNewSectionPointer() {
        const sectionPointer = {
            section_id: section.id,
            target_section_id: selectedTargetSection.id,
            type: selectedType,
        };

        return sectionPointer;
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
                <Button type='neutral' clickEvent={() => setModal(null)}>Cancel</Button>
                <Button 
                    type='constructive' 
                    pendingResponseClickEvent={{
                        args: [getNewSectionPointer()],
                        event: sectionPointers.add
                    }}
                    postEventCallback={() => setModal(null)}
                >Create</Button>
            </div>
        </div>
    )
}