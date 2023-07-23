export default function MultiToggleOption({clickEvent, isActive, children}) {

    return (
        <button 
            className={`MultiToggleOption ${isActive && 'active'}`}
            onClick={clickEvent}>
            {children}
        </button>
    )

}