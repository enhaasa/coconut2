import React, { useContext } from 'react';

//Contexts
import { ControlStatesContext } from '../api/ControlStates';

//Components
import ContextMenu from './common/ContextMenu/ContextMenu';
import ContextMenuItem from './common/ContextMenu/ContextMenuItem';

//Tools
import uuid from 'react-uuid';

export default function Main({ children }) {

    const {
        contextMenu
    } = useContext(ControlStatesContext);
    
    return (
        <main className='ContextMenuCanvas'>
            {contextMenu.content && 
                <ContextMenu x={contextMenu.posX} y={contextMenu.posY} title={contextMenu.title}>
                    {contextMenu.content.map(option => (
                        <ContextMenuItem 
                            key={uuid()}
                            clickEvent={option.clickEvent}>
                                {option.name}
                        </ContextMenuItem>
                    ))}
                </ContextMenu>
            }
            {children}
        </main>
    )
}