import { useContext } from "react"

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

export default function MessageManager() {

    const {
        messages
    } = useContext(DynamicDataContext);


    function handleClose(index) {
        messages.remove(index);
    }

    return (
        <div className='MessageManager'>
            {
                messages.get.map((message, index) => (
                    <div className={`message ${message.type}`}>
                        <div className='title-bar'>
                            <span className='title'>
                                {message.title}
                            </span>
                            <button className='close-button' onClick={() => handleClose(index)}>X</button>
                        </div>
                        <div className='content'>{message.content}</div>
                    </div>
                ))
            }
        </div>
    )
}