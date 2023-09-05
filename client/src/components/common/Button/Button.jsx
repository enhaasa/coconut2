import { useContext, useState, useEffect, useRef } from "react"
import { DynamicDataContext } from "../../../api/DynamicData"
import uuid from "react-uuid";

import Spinner from "../AnimatedIcon/Spinner";

export default function Button(props) {

    const {
        children, 
        type, 
        clickEvent, 
        pendingResponseClickEvent, 
        ID, 
        postEventCallback
    } = props;

    const {
        pendingRequestIDs,
    } = useContext(DynamicDataContext);

    const [ isPendingResponse, setIsPendingResponse ] = useState(false);

    const buttonID = useRef(ID !== undefined ? ID : uuid());
    function handleClick() {
        if (pendingResponseClickEvent) {
            setIsPendingResponse(true);
            
            const { args, event } = pendingResponseClickEvent;

            pendingRequestIDs.add(buttonID.current);
            event(...args, buttonID.current);
        } else {
            clickEvent();
        }
    }

    useEffect(() => {
        if(!isPendingResponse) return;
        if (!pendingRequestIDs.get.includes(buttonID.current)) {
            setIsPendingResponse(false);
            if (postEventCallback) {
                postEventCallback();
            }
        }
    }, [pendingRequestIDs.get]);

    const isLoading = pendingRequestIDs.get.includes(buttonID.current);

    return (
        <button className={`Button ${type} ${isLoading && 'inactive'}`} onClick={handleClick}>
            {
                isLoading
                ? <><Spinner /> <div>{children}</div></>
                : children
            }
        </button>
    )
}