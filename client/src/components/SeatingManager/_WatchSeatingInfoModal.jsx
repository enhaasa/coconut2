export default function WatchSeatingInfoModal() {
    return (
        <div className='WatchSeatingInfoModal'>
            Watching means you will get a notification when:
            <ul>
                <li>An order is added.</li>
                <li>A service is added.</li>
                <li>An order still isn't delivered, 10 minutes after being placed.</li>
                <li>A service has passed the scheduled time without being started.</li>
            </ul>
            Setting yourself as waiter will automatically enable this option.
        </div>
    )
}