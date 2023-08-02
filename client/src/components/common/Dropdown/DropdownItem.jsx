export default function DropdownItem({ children, value }) {

    return(
        <option value={value} className='DropdownItem'>
            {children}
        </option>
    )
}