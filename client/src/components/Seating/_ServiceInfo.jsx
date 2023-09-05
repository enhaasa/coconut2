import React, { useContext, useEffect, useState } from 'react';

//Components
import PlaySound from '../../utils/PlaySound.ts';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Tools
import { getCurrentDate, timeToEpoch } from '../../utils/time';

export default function ServiceInfo({ service }) {
    const {
        services,
        localSettings,
    } = useContext(DynamicDataContext);

    const {
        getStatus
    } = services.utils;

    const [ status, setStatus ] = useState(getStatus(service));
    const { watchedSeatings } = localSettings;

    useEffect(() => {
        const timer = setInterval(() => {
            setStatus(getStatus(service));
            const currentDateTime = timeToEpoch(getCurrentDate());
            const pref_start_datetime = timeToEpoch(service.pref_start_datetime);
            const watchSettings = watchedSeatings.find(ws => ws.id === service.seating_id);


            // Guard clause: Is table watched?
            if (!watchSettings || !watchSettings.triggers.includes('services')) return;

            if (service.start_datetime) return;

            // Guard clause: Has max delivery time been passed, and at least one minute since last ping?
            if (currentDateTime < pref_start_datetime) return;
            if ((currentDateTime - pref_start_datetime) % 60000 !== 0) return;

            // If yes, then ping.
            PlaySound.lateService();
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [ service, getStatus ]);

    return (
        <div className='item'>
            <div className={`amount`}>
                {service.name}
            </div>

            <div className={`time ${status.color}`}>
                {status.icon}
                {status.text}
            </div>
        </div>
    )
}