import { useState, useContext } from 'react';

//Components
import Button from '../common/Button/Button';
import DeleteButton from '../common/Button/_DeleteButton';

//Contexts
import { DynamicDataContext } from '../../api/DynamicData';

export default function TipModal(props) {
    const { handleModal, tip } = props;

    const { tips } = useContext(DynamicDataContext);

    const [ name, setName ] = useState(tip ? tip.name : '');
    const [ amount, setAmount ] = useState(tip ? tip.amount : 0);

    function handleNameChange(newValue) {
        setName(newValue);
    }
    function handleAmountChange(newValue) {
        setAmount(newValue);
    }

    return(
        <div className='TipModal'>
            <div className='row'>
                <label>Name: </label>
                <input 
                type='text'
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder={'Enter name...'}
                />
            </div>

            <div className='row'>
                <label>Amount: </label>
                <input 
                    type='number'
                    value={amount}
                    onChange={e => handleAmountChange(e.target.value)}
                    placeholder={'Enter amount...'}
                />
            </div>

            <div className='submit-container'>
                {tip 
                ? <Button 
                    type='constructive'
                    pendingResponseClickEvent={{
                        args: [{
                            tip: tip, 
                            newName: !name ? 'Anonymous' : name,
                            newAmount: !amount ? parseInt(0) : parseInt(amount)
                        }],
                        event: tips.edit
                    }}
                    postEventCallback={() => handleModal(null)}
                    >Update</Button>

                : <Button 
                    type='constructive'
                    pendingResponseClickEvent={{
                        args: [{
                            name: !name ? 'Anonymous' : name, 
                            amount: !amount ? parseInt(0) : parseInt(amount), 
                        }],
                        event: tips.add
                    }}
                    postEventCallback={() => handleModal(null)}
                    >Add Tip</Button>

                }

                {tip && 
                    <DeleteButton 
                        type='destructive' 
                        pendingResponseClickEvent={{
                            args: [tip],
                            event: tips.remove
                        }}
                        postEventCallback={() => handleModal(null)} />
                }
            </div>
        </div>
    )
}