import React, { useContext, useEffect, useState } from 'react';

//Contexts
import { DynamicDataContext } from '../../../api/DynamicData';

export default function ServiceInfo({ service }) {
    const {
        services,
    } = useContext(DynamicDataContext);

    const {
        getStatus
    } = services.utils;

    const [ status, setStatus ] = useState(getStatus(service));

    useEffect(() => {
        const timer = setInterval(() => {
            setStatus(getStatus(service));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [ service, getStatus ]);

    return (
        <>
            {status.text}
        </>
    )
}