import { useContext } from "react";
import { ControlStatesContext } from "../../../api/ControlStates";

export default function ContextMenu(props) {

    const {
        children, x, y, title
    } = props;

    const {
        isDangerousSettings,
    } = useContext(ControlStatesContext);

    return (
        <div style={{ left: x, top: y }}className='ContextMenu'>
            <div className='title'>{title}</div>
            <div className='list'>
                {
                    isDangerousSettings ?
                    children :
                    <span className='noaccess'>Dangerous Settings are disabled, or you lack the required permission.</span>
                }
            </div>
        </div>
    )
}