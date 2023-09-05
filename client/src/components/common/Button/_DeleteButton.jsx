import Button from './Button';
import trashcanWhite from './../../../assets/icons/trashcan-white.png';

export default function DeleteButton(props) {
    const {
        clickEvent, 
        pendingResponseClickEvent, 
        ID, 
        postEventCallback
    } = props;

    return (
        <Button 
            type='destructive'
            clickEvent={clickEvent}
            pendingResponseClickEvent={pendingResponseClickEvent}
            ID={ID}
            postEventCallback={postEventCallback}
        >
        <img src={trashcanWhite} alt='Delete'/>
        </Button>
    )
}