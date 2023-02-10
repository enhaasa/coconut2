import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import animations from '../animations';

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
        <div className="ConfirmBoxContainer" ref={ConfirmBoxRef}>
            <div className="confirmBox">
                <div className="title">
                    {title}
                </div>

                <div className="message">
                    {message}
                </div>

                <nav className="options">
                    <button className="yes" onClick={onYes}>Confirm</button>
                    <button className="no" onClick={onNo}>Cancel</button>
                </nav>
            </div>
        </div>
    );
}