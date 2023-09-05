import { useState } from 'react';
import useSocketListener from '../useSocketListener';

import stopwatchIconBlack from './../../assets/icons/stopwatch-black.png';
import stopwatchIconWhite from './../../assets/icons/stopwatch-white.png';

import { 
    convertDatetimeFormat,
    compareDates,
    getCurrentDate
 } from '../../utils/time';

import PlaySound from '../../utils/PlaySound.ts';

export default function useServices(init, props) {

    const {
        socket,
        localSettings,
    } = props;

    const [ services, setServices ] = useState(init);
    const eventHandlers = {
        getServices: (items) => {
            setServices(items);
        },

        addService: (item) => {
            setServices(prev => ([...prev, 
                {
                    ...item,
                    pref_start_datetime: item.pref_start_datetime && convertDatetimeFormat(item.pref_start_datetime)
                }
            ]));

            const watchedSeating = localSettings.watchedSeatings.find(ws => ws.id === item.seating_id);

            if (watchedSeating.triggers.includes('services')) {
                PlaySound.newService();
            }
        },

        removeService: (serviceToRemove) => {
            setServices(prev => (
                prev.filter(service => (
                    service.id !== serviceToRemove.id
                ))
            ));
        },

        setServiceAttributes: (data) => {
            const { service, attributes } = data;
            const index = services.findIndex(s => s.id === service.id);

            setServices(prev => {
                attributes.forEach(a => {
                    prev[index][a[0]] = a[1];
                });

                return [...prev];
            });
        },

        setServicesAttributes: (data) => {
            const { key, value, attributes } = data;

            setServices(prev => {
                prev.forEach(item => {
                    if (item[key] === value) {
                        attributes.forEach(attr => {
                            item[attr[0]] = attr[1];
                        });
                    }
                })

                return [...prev];
            });
        },
    };

    useSocketListener(socket, eventHandlers);

    function add(service, requestID) {
        socket.emit('addService', { service, requestID });
    }

    function remove(service) {
        socket.emit('removeService', { ...service });
    }

    function start(service, requestID) {
        socket.emit('startService', { service, requestID });
    }

    function stop(service, requestID) {
        socket.emit('stopService', { service, requestID });
    }

    function restart(service, requestID) {
        socket.emit('restartService', { service, requestID });
    }

    function complete(service, requestID) {
        socket.emit('completeService', { service, requestID });
    }

    function refresh() {
        socket.emit('getServices');
    }
    
    return {
        get: services,
        add,
        remove,
        start,
        stop,
        restart,
        complete,
        refresh,
        utils: {
            calculatePPMTotal,
            getScheduledServiceTimeDiff,
            getOngoingServiceTimeDiff,
            getStatus
        }
    }

    function calculatePPMTotal(startDate, endDate, minuteInterval, pricePerMinute) {
        if (minuteInterval === 0) {
            return pricePerMinute;
        }
    
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        const timeDifferenceInMinutes = Math.floor((endDateTime - startDateTime) / (1000 * 60));
    
        const intervalsPassed = Math.ceil(timeDifferenceInMinutes / minuteInterval);
        const total = intervalsPassed * pricePerMinute;
    
        return total;
    }
    
    function getScheduledServiceTimeDiff(service) {
        let string = '';
        const startDatetime = service.pref_start_datetime;
        const currentDatetime = getCurrentDate();
    
        if (startDatetime > currentDatetime) {
            string += `In ${compareDates(currentDatetime, startDatetime)}`;
        } else if (startDatetime === currentDatetime) {
            string += 'Now';
        } else {
            string += `${compareDates(startDatetime, currentDatetime)} ago`;
        } 
        
        return string;
    }
    
    function getOngoingServiceTimeDiff(service) {
        const startDatetime = service.start_datetime;
        const endDatetime = service.end_datetime;
    
        if (endDatetime) return compareDates(startDatetime, endDatetime);
        return compareDates(startDatetime, getCurrentDate());
    }

    function getStatus(service) {
        const { pref_start_datetime, start_datetime } = service;
        const currentDate = getCurrentDate();

        // Service currently ongoing
        if (service.start_datetime && !service.end_datetime) {
            return {
                color: 'constructive',
                text: `Ongoing (${getOngoingServiceTimeDiff(service)})`
            }
        }

        // Service is finished
        if (service.start_datetime && service.end_datetime) {
            return {
                color: 'constructive',
                text: `Finished (${compareDates(service.start_datetime, service.end_datetime)})`
            }
        }

        // Not scheduled and not started
        if (!pref_start_datetime && !start_datetime) {
            return {
                icon: <img src={stopwatchIconWhite} alt='Stopwatch Icon' />,
                color: 'neutral',
                text: 'Ask Customer'
            };
        }

        // Scheduled but startdate greater than current time
        if (pref_start_datetime && pref_start_datetime > currentDate) {
            return {
                icon: <img src={stopwatchIconBlack} alt='Stopwatch Icon' />,
                color: 'progressive',
                text: getScheduledServiceTimeDiff(service)
            };
        }

        // Scheduled but startdate has been passed
        if (pref_start_datetime && !start_datetime && pref_start_datetime < currentDate) {
            return {
                icon: <img src={stopwatchIconWhite} alt='Stopwatch Icon' />,
                color: 'destructive',
                text: getScheduledServiceTimeDiff(service)
            };
        }

        return {
            icon: null,
            color: 'neutral'
        }
    }
}