import React, { useContext } from 'react';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';
import { ControlStatesContext } from '../../api/ControlStates';

//Components
import MultiToggle from '../common/MultiToggle/MultiToggle';
import MultiToggleOption from '../common/MultiToggle/MultiToggleOption';
import Button from '../common/Button/Button';
import SectionNotificationBar from '../common/NotificationBar/SectionNotificationBar';

//Tools
import uuid from 'react-uuid';

//Icons
import logo from './../../assets/icons/logo.png';
import Toggle from '../common/Toggle/Toggle';

export default function TopNav() {

    const {
        sections
    } = useContext(DynamicDataContext);

    const { 
        selectedSection,
        setSelectedSection,
        isDangerousSettings,
        setIsDangerousSettings,
    } = useContext(ControlStatesContext);

    return (
        <section className='TopNav'>
            <span className='column'>
                <span className='logo'>
                    <img className='image' src={logo} alt='' />
                    <span className='info-container'>
                        <div className='title'>Coconut</div>
                        <div className='author'>by Enhasa</div>
                    </span>
                </span>
            </span>

            <span className='column'>
                <div className='section-nav'>
                    <span className='sections'>
                        <div className='row'>
                            <div className='title'>
                                Main Sections
                            </div>
                            <div className='nav'>
                                <MultiToggle>
                                    {
                                        sections.get.map((section, index) => (
                                            section.type === 'main' &&
                                            <>
                                                <MultiToggleOption 
                                                    type={'large'}
                                                    clickEvent={() => setSelectedSection(index)}
                                                    isActive={selectedSection === index ? true : false}
                                                    key={uuid()}>
                                                        <SectionNotificationBar key={uuid()} section={section}/>
                                                        {section.name}
                                                </MultiToggleOption>
                                            </>
                                        ))
                                    }
                                </MultiToggle>
                                {false && <Button type='constructive'>Add</Button>}
                            </div>
                        </div>

                        <div className='row'> 
                            <div className='title'>
                                Subsections
                            </div>
                            <div className='nav'>
                                <MultiToggle>
                                    {
                                        sections.get.map((section, index) => (
                                            section.type === 'sub' &&
                                            <MultiToggleOption 
                                                clickEvent={() => setSelectedSection(index)}
                                                isActive={selectedSection === index ? true : false}
                                                key={uuid()}>
                                                <SectionNotificationBar key={uuid()} type='small' section={section}/>
                                                {section.name}
                                            </MultiToggleOption>
                                        ))
                                    }
                                </MultiToggle>
                                {false && <Button type='constructive'>Add</Button>}
                            </div>
                        </div>
                    </span>

                    <span className='buttons'>

                    </span>
                </div>
            </span>

            <span className='column'>
                <div className='user'>
                    <div className='character'>Character Name</div>
                    <div className='dangerous-settings'>
                        Allow Dangerous Settings
                        <Toggle 
                            value={isDangerousSettings}
                            clickEvent={() => {setIsDangerousSettings(!isDangerousSettings)}}
                        />
                    </div>
                </div>
            </span>
        </section>
    )
}