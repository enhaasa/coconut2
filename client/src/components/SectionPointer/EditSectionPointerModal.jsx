import React, { useContext } from 'react';

//Components
import Dropdown from "../common/Dropdown/Dropdown";
import DropdownItem from "../common/Dropdown/DropdownItem";
import Button from '../common/Button/Button';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

export default function EditSectionPointerModal(sectionPointer) {

    const {
        sections,
        sectionPointers
    } = useContext(DynamicDataContext);

    return (
        <div className='EditSectionPointerModal'>
            <div className='row'>
                <span className='label'>Icon</span>
                <span className='selector'>
                    <Dropdown>
                        <DropdownItem>Bar</DropdownItem>
                        <DropdownItem>Seating</DropdownItem>
                    </Dropdown>
                </span>
            </div>
            <div className='row'>
                <span className='label'>Target</span>
                <span className='selector'>
                    <Dropdown>
                        {sections.get.map(section => (
                            <DropdownItem>{section.name}</DropdownItem>
                        ))}
                    </Dropdown>
                </span>
            </div>
            <div className='row bottom-nav'>
                <Button type='destructive'>Delete</Button>
                <Button type='constructive'>Save</Button>
            </div>
        </div>
    )
}