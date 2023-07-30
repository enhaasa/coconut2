export default function Button({ children, type, clickEvent}) {

    return (
        <button className={`Button ${type}`} onClick={clickEvent}>
            {children}
        </button>
    )
}