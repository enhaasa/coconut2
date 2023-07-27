


export default function Dropdown({ children, onChangeEvent, defaultValue }) {

    return(
        <select className="Dropdown" value={defaultValue} onChange={onChangeEvent}>
            {children}
        </select>
    )
}