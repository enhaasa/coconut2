export default function ContextMenuItem({ clickEvent, children }) {

    return (
        <button onClick={clickEvent} className='ContextMenuItem'>
            {children}
        </button>
    )
}