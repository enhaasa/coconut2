import React, { useLayoutEffect, useRef }from 'react';

//Components
import CloseButton from '../CloseButton/CloseButton';

//Animations
import animations from '../../../animations.js';
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

    function handleClose(){
        gsap.to(ref.current, animations.fadeFall);

        setTimeout(()=> {
            closeButtonEvent();
        }, 100)
    }

    return(
        <div className='modal-container'>
            <div className='Modal' ref={ref}>
                <div className='title-bar'>
                    <span className='title'>{title}</span>
                    <CloseButton clickEvent={handleClose} />
                </div>
                <div className='content'>
                    {children}
                </div>
            </div>
        </div>
    )
}