import React, { useContext } from 'react';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

//Components
import Table from '../common/Table/Table';
import TableItem from '../common/Table/TableItem';  
import Button from '../common/Button/Button';
import TipModal from './_TipModal';

//Tools
import { formatStringAsPrice } from '../../utils/currency';
import uuid from 'react-uuid';

export default function TipsManager(props) {
    const { tipsTotal, handleModal } = props;

    const { tips } = useContext(DynamicDataContext);

    function handleEdit(tip) {
        handleModal({
            title: 'Edit Tip',
            content: <TipModal tip={tip} handleModal={handleModal} />
        });
    }

    return(
        <div className='TipsManager'>
            <div className='list'>

                <Table>
                    {tips.get.map(tip => (
                        <TableItem 
                            key={uuid()} 
                            cols={
                                [
                                    {
                                        type: 'main',
                                        content: tip.name, 
                                    }, {
                                        type: 'number',
                                        content: formatStringAsPrice(tip.amount.toString()) + ' gil',
                                    }, {   
                                        type: 'nav',
                                        content: 
                                        <>
                                            <Button 
                                                type='neutral'
                                                clickEvent={() => handleEdit(tip)}>
                                                Edit
                                            </Button>
                                        </>
                                    }
                                ]
                            } />
                    ))}
                </Table>

            </div>

            <div className='bottom-list'>
                <div className='total'>
                    {`Total: ${tipsTotal.toLocaleString('en-US')} gil`}
                </div>
            </div>
        </div>
    )
}