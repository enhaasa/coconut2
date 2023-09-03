//Components
import TableItem from '../Table/TableItem';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import ServiceInfo from './_ServiceInfo';
import DeleteButton from '../Button/_DeleteButton';
import ResetButton from '../Button/_ResetButton';

//Contexts
import { DynamicDataContext } from '../../../api/DynamicData';
import { useContext } from 'react';

//Icons
import infoIcon from './../../../assets/icons/info-small-white.png';

export default function Service(props) {
    const { 
        service,
        handleItemInfo,
    } = props;

    const {
        services,
        serviceMenu,
    } = useContext(DynamicDataContext);

    function getServiceItemByID(ID) {
        const item = serviceMenu.get.find(smi => smi.id === ID);
        return item;
    }

    let price = `${service.price.toLocaleString('en-US')} gil`;
    if (service.minute_interval > 0) price += ' / minute'

    const tablecols = [
        {
            type: 'nav',
            content: 
            <>
                <IconButton type='tooltip' clickEvent={() => handleItemInfo(getServiceItemByID(service.menu_id))}>
                    <img src={infoIcon} alt='' className='tooltip' />

                    <span className='tooltiptext'>
                        {price}
                    </span>
                </IconButton>
            </>
        }, {
            type: 'main',
            content: service.name
        },  {
            type: 'text',
            content: <ServiceInfo service={service} />
        }
    ];

    if (!service.is_completed) {
        tablecols.push({
            type: 'nav',
            content: 
            <>
                <DeleteButton 
                    type='destructive' 
                    ID={`RemoveService${service.id}`}
                    pendingResponseClickEvent={{
                        args: [{
                            service
                        }],
                        event: services.remove
                    }} />

                <ResetButton 
                    ID={`RestartService${service.id}`}
                    pendingResponseClickEvent={{
                        args: [service],
                        event: services.restart
                }} />
                
                {!service.start_datetime
                    && <Button 
                            type='neutral' 
                            ID={`StartService${service.id}`}
                            pendingResponseClickEvent={{
                                args: [service],
                                event: services.start
                            }}>
                        Start
                      </Button>
                }

                {service.start_datetime && !service.end_datetime
                    && <Button 
                            type='neutral' 
                            ID={`StopService${service.id}`}
                            pendingResponseClickEvent={{
                                args: [service],
                                event: services.stop
                            }}>
                        Stop
                      </Button>
                }

                {service.end_datetime 
                    && <>
                        <Button 
                            type='neutral' 
                            ID={`StartService${service.id}`}
                            pendingResponseClickEvent={{
                                args: [service],
                                event: services.start
                            }}>
                            Continue
                        </Button>

                        <Button 
                            type='neutral' 
                            ID={`CompleteService${service.id}`}
                            pendingResponseClickEvent={{
                                args: [service],
                                event: services.complete
                            }}>
                            Complete
                        </Button>
                    </>
                }
            </>
        });
    }

    return (
        <TableItem cols={tablecols}/>
    )
}
