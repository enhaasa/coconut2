import React, { useLayoutEffect, useRef }from 'react';

//Components
import CloseButton from './common/CloseButton/CloseButton';

//Animations
import animations from '../animations.js';
import { gsap } from 'gsap';

export default function Modal({title, closeButtonEvent, children}) {

    const ref = useRef();
    useLayoutEffect(() => {
        //gsap.from(ref.current, animations.softElastic);

        const element = ref.current;
        const timeline = gsap.timeline();
        
        timeline.from(element, animations.softElastic);
    
        // Cleanup function to run when component is unmounted
        return () => {
          timeline.kill();
        };

    }, []);

    return(
        <div className='modal-container'>
            <div className='Modal' ref={ref}>
                <div className='title-bar'>
                    <span className='title'>{title}</span>
                    <CloseButton clickEvent={() => closeButtonEvent()} />
                </div>
                <div className='content'>
                    {children}
                </div>
            </div>
        </div>
    )
}