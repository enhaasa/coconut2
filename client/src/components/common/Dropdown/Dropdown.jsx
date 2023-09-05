export default function Dropdown({ children, onChangeEvent, value }) {

    return(
        <select className='Dropdown' value={value} onChange={onChangeEvent}>
            {children}
        </select>
    )
}