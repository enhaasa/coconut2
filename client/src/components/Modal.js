import closeIcon from './../assets/icons/close.png';
import { gsap } from 'gsap';
import animations from '../animations.js'
import React, { useLayoutEffect, useState, useRef }from 'react';

function Modal({title, closeButtonEvent, children}) {

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
        <div className="modalContainer">
            <div className="Modal" ref={ref}>
                <div className="titleBar">
                    <span className="title">{title}</span>
                    <button className="closeButton" onClick={() => closeButtonEvent()}>
                        <img src={closeIcon} alt="" />
                    </button>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal;