export default function Toggle({ value, clickEvent }) {

    return (
        <label className='Toggle'>
            <input 
                type='checkbox' 
                readOnly 
                checked={value}
                onClick={clickEvent} />
            <span className='slider' />
        </label>
    )
}