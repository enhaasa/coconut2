export default function Table({ children }) {

    return (
        <table className='Table'>

            <tbody>
                {children}
            </tbody>
        </table>
    )
}