import React, { useContext } from 'react';
import { DynamicDataContext } from '../api/DynamicData';
import TipModal from "./TipModal";
import tools from "../tools";
import uuid from 'react-uuid';
import Table from "./common/Table/Table";
import TableItem from "./common/Table/TableItem";  
import Button from './common/Button/Button';

function TipsManager(props) {
    const { tipsTotal, handleModal } = props;

    const { tips } = useContext(DynamicDataContext);

    function handleEdit(tip) {
        handleModal({
            title: "Edit Tip",
            content: <TipModal tip={tip} handleModal={handleModal} />
        });
    }

    return(
        <div className="TipsManager">
            <div className="list">

                <Table>
                    {tips.get.map(tip => (
                        <TableItem 
                        key={uuid()} 
                        cols={
                            [
                                {
                                    type: 'text',
                                    content: tip.name, 
                                },
                                {
                                    type: 'number',
                                    content: tools.formatStringAsPrice(tip.amount.toString()) + " gil",
                                },
                                {   
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

            <div className="total">
                {`Total: ${tipsTotal.toLocaleString("en-US")} gil`}
            </div>
        </div>
    )
}

export default TipsManager;