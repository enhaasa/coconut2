import Button from './Button';
import resetIcon from './../../../assets/icons/reset-small-white.png';

export default function DeleteButton(props) {
    const {
        clickEvent, 
        pendingResponseClickEvent, 
        ID, 
        postEventCallback
    } = props;

    return (
        <Button 
            type='neutral'
            clickEvent={clickEvent}
            pendingResponseClickEvent={pendingResponseClickEvent}
            ID={ID}
            postEventCallback={postEventCallback}
        >
        <img src={resetIcon} alt='Delete'/>
        </Button>
    )
}