import { useContext, useMemo } from "react"
import { DynamicDataContext } from "../../../api/DynamicData"

export default function SectionNotificationBar({ type, section }) {

    const {
        orders
    } = useContext(DynamicDataContext);

    const display = useMemo(() => {
        const ordersInSection = orders.get.filter(order => order.section_id === section.id && !order.is_delivered);
        const display = ordersInSection.length > 0 ? ordersInSection.length : null;

        return display;
    }, [orders.get]);

    return (
        <div className='NotificationBar'>
            {display &&
                <div className={`item ${type}`}>
                    {display}
                </div>
            }
        </div>
    )
}