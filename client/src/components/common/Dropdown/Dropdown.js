


export default function Dropdown({ children, onChangeEvent }) {

    return(
        <select className="Dropdown" onChange={onChangeEvent}>
            {children}
        </select>
    )
}