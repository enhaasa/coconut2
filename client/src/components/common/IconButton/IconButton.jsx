export default function IconButton ({ children, clickEvent, type}) {

    return (

        <button className={`IconButton ${type}`} onClick={clickEvent}>
            {children}
        </button>
    )
}