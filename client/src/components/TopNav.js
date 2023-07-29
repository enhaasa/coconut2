import React, { useContext } from 'react';

//Contexts
import { DynamicDataContext } from '../api/DynamicData';
import { ControlStatesContext } from '../api/ControlStates';

//Components
import MultiToggle from './common/MultiToggle/MultiToggle';
import MultiToggleOption from './common/MultiToggle/MultiToggleOption';

//Tools
import uuid from 'react-uuid';

//Icons
import logo from './../assets/icons/logo.png';


export default function TopNav() {

    const {
        sections
    } = useContext(DynamicDataContext);

    const { 
        selectedSection,
        setSelectedSection,
    } = useContext(ControlStatesContext);

    return (
        <section className='TopNav'>
            <span className='logo'>
                <img className='image' src={logo} alt='' />
                <span className='info-container'>
                    <div className='title'>Coconut</div>
                    <div className='author'>by Enhasa</div>
                </span>
            </span>

            <MultiToggle>
                {
                    sections.get.map((section, index) => (
                        <MultiToggleOption 
                            clickEvent={() => setSelectedSection(index)}
                            isActive={selectedSection === index ? true : false}
                            key={uuid()}>
                            {section.name}
                        </MultiToggleOption>
                    ))
                }
            </MultiToggle>

            <span>
                Character Name
            </span>
        </section>
    )
}