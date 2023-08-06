import React, { useContext } from 'react';

//Contexts
import { ControlStatesContext } from '../api/ControlStates';

//Components
import ContextMenu from './common/ContextMenu/ContextMenu';
import ContextMenuItem from './common/ContextMenu/ContextMenuItem';
import MessageManager from './MessageManager/MessageManager';

//Tools
import uuid from 'react-uuid';
import MenuManager from './MenuManager/MenuManager';

export default function Main({ children }) {

    const {
        contextMenu,
        showRawMenu,
        setShowRawMenu,
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
            {
                showRawMenu &&
                <div className='raw-menu-container'>
                    <MenuManager closeButtonEvent={() => setShowRawMenu(false)}/>
                </div>
            }

            <MessageManager />
            {children}
        </main>
    )
}