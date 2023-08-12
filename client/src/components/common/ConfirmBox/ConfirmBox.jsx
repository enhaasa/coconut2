import React, { useLayoutEffect, useRef, useContext, useEffect, useState } from 'react';
import { DynamicDataContext } from '../../../api/DynamicData';
import uuid from 'react-uuid';

//Components
import Button from '../Button/Button';

//Animations
import gsap from 'gsap';
import animations from '../../../animations';
import Spinner from '../AnimatedIcon/Spinner';

export default function ConfirmBox(props) {

    const { data } = props;
    const { 
        callback, 
        closeConfirmBox, 
        title, 
        message, 
        pendingRequestEvent, 
        ID, 
        postEventCallback 
    } = data;

    const {
        pendingRequestIDs,
    } = useContext(DynamicDataContext);

    const [ isPendingResponse, setIsPendingResponse ] = useState(false);

    const ConfirmBoxRef = useRef();
    useLayoutEffect(() => {
        gsap.from(ConfirmBoxRef.current, animations.softElastic);

        return () => {
            gsap.to(ConfirmBoxRef.current, animations.softElastic);
        }
    }, []);

    const buttonID = useRef(ID !== undefined ? ID : uuid());
    function onYes () {
        if (pendingRequestEvent) {
            const { event, args } = pendingRequestEvent;

            pendingRequestIDs.add(buttonID.current);
            setIsPendingResponse(true);
            event(...args, buttonID.current);
        } else {
            callback();
            closeConfirmBox();
        }
    }

    function onNo() {
        closeConfirmBox();
    }

    useEffect(() => {
        if(!isPendingResponse) return;

        if (!pendingRequestIDs.get.includes(buttonID.current)) {
            if (postEventCallback) postEventCallback();
            closeConfirmBox();
        }
    }, [pendingRequestIDs.get]);

    const isLoading = pendingRequestIDs.get.includes(buttonID.current);

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
                    {isLoading
                    ? <Button type='inactive' clickEvent={onYes}>
                        <Spinner />Confirm</Button>
                    : <Button type='destructive' clickEvent={onYes}>Confirm</Button>

                    }

                    <Button type='neutral' clickEvent={onNo}>Cancel</Button>
                    
                </nav>
            </div>
        </div>
    );
}