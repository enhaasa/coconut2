import React, { useLayoutEffect, useRef } from 'react';

//Components
import Button from '../Button/Button';

//Animations
import gsap from 'gsap';
import animations from '../../../animations';

export default function ConfirmBox(props) {

    const ConfirmBoxRef = useRef();
    useLayoutEffect(() => {
        gsap.from(ConfirmBoxRef.current, animations.softElastic);

        return () => {
            gsap.to(ConfirmBoxRef.current, animations.softElastic);
        }
    }, []);

    const callback = props.data.callback;
    const closeConfirmBox = props.data.closeConfirmBox;
    const title = props.data.title;
    const message = props.data.message;

    function onYes () {
        callback();
    }

    function onNo() {
        closeConfirmBox();
    }

    return (
        <div className='confirm-box-container' ref={ConfirmBoxRef}>
            <div className='confirm-box'>
                <div className='title'>
                    {title}
                </div>

                <div className='message'>
                    {message}
                </div>

                <nav className='options'>
                    <Button type='destructive' clickEvent={onYes}>Confirm</Button>
                    <Button type='neutral' clickEvent={onNo}>Cancel</Button>
                    
                </nav>
            </div>
        </div>
    );
}