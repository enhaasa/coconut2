export default function ContextMenu(props) {

    const {
        children, x, y, title
    } = props;

    return (
        <div style={{ left: x, top: y }}className='ContextMenu'>
            <div className='title'>{title}</div>
            <div className='list'>
                {children}
            </div>
        </div>
    )
}