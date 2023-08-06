import logo from './../../../assets/icons/logo.png';

export default function Logo() {

    return (
        <div className='Logo'>
            <img className='image' src={logo} alt='' />
            <span className='info-container'>
                <div className='title'>Coconut</div>
            </span>
        </div>
    )
}