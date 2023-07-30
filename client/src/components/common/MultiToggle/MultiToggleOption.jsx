export default function MultiToggleOption({clickEvent, isActive, children, type}) {

    return (
        <button 
            className={`MultiToggleOption ${isActive && 'active'} ${type}`}
            onClick={clickEvent}>
            {children}
        </button>
    )

}