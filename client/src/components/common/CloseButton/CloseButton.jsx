import closeButton from './../../../assets/icons/close-white.png';

export default function CloseButton ({ clickEvent }) {

    return (
        <button className='CloseButton' onClick={clickEvent}>
            <img src={closeButton} alt='Close Button'/>
        </button>
    )
}