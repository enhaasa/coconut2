import uuid from "react-uuid"

export default function TableItem({ cols }) {

    return (
        <tr className="TableItem">
            {cols.map(col => (
                <td className={col.type} key={uuid()}>{col.content}</td>
            ))}
        </tr>
    )
}