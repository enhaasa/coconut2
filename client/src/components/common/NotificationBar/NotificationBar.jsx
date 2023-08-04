//Icons
import orderIcon from './../../../assets/icons/order-small-black.png';
import userIcon from './../../../assets/icons/user-black.png';

export default function NotificationBar(props) {
    const { orders, customers} = props;
    
    const notifications = [
        {
            name: 'orders',
            class: 'progressive',
            icon: orderIcon,
            number: orders.length
        },
        {
            name: 'customers',
            class: 'informative',
            icon: userIcon,
            number: customers.length
        }
    ]

    return (
        <div className='notification-bar'>
            
            {
            notifications.map((notification, index) => (
                notification.number > 0 &&
                <span className='notification-container' key={`notification${index}`}>
                    <span className={`notification ${notification.class}`}>
                        <img className='icon' src={notification.icon}>
                            
                        </img>
                        <span className='number'>
                            {notification.number}
                        </span>
                    </span>
                </span>
            ))
            }
        </div>
    )
}