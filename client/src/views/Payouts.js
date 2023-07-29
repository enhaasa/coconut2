import React, { useState, useContext } from 'react';

//Components
import ReceiptManager from './../components/ReceiptManager';
import AttendingStaff from '../components/AttendingStaff';
import TipsManager from '../components/TipsManager';
import TipModal from './../components/TipModal';
import Modal from '../components/Modal';
import Button from '../components/common/Button/Button';
import Dropdown from '../components/common/Dropdown/Dropdown';
import DropdownItem from '../components/common/Dropdown/DropdownItem';

//Contexts
import { DynamicDataContext } from '../api/DynamicData';

//Tools
import uuid from 'react-uuid';


export default function Payouts(props) {
    const { setIsBlurred } = props;
    const { tips, archivedSessions, staff, sections } = useContext(DynamicDataContext);
    
    const [ modal, setModal ] = useState(null);

    const ordersTotal = archivedSessions.get.reduce((t, c) => t + c.amount_paid, 0);
    const tipsTotal = tips.get.reduce((total, current) => total + parseInt(current.amount), 0);
    const attendingStaff = staff.get.filter(s => s.is_attending);
    const absentStaff = staff.get.filter(s => !s.is_attending);
    const tipsAndOrders = parseInt(ordersTotal) + parseInt(tipsTotal);

    const [ selectedFilter, setSelectedFilter ] = useState(0);
    const receiptFilters = [
        {
            title: 'My Receipts',
            parse: arr => arr
        },
        {
            title: 'All',
            parse: arr => arr
        },
        ...sections.get.map(section => ({
            title: section.name,
            parse: arr => arr.filter(i => i.channel.section_name === section.name)
        }))
    ];

    function handleModal(state) {
        setModal(state);
        state ? setIsBlurred(true) : setIsBlurred(false);
    }

    function handleAddTip() {
        handleModal({
            title: 'Add Tip',
            content: <TipModal handleModal={handleModal} />
        });
    }

    function handleAttendingModal(isVisible) {
        if (isVisible) {
            handleModal({
                title: 'Add attending staff',
                content:
                <div className='addStaffModal'>
                    {absentStaff.map(s => <button key={uuid()} onClick={() => staff.setAttribute(s, 'is_attending', true)}>{s.name}</button>)}
                </div>
            });
        } else {
            handleModal(null);
        }
    }

    return(
        <>
            {modal && 
                <Modal title={modal.title} closeButtonEvent={() => handleModal(null)}> 
                    {modal.content}
                </Modal>
            }

            <div className='Payouts'>
                <div className='column left'>
                    <section>
                        <div className='nav'>
                            <span className='title'>General Tips</span>
                            <Button type='constructive' clickEvent={handleAddTip}>Add Tip</Button>
                        </div>
                        <div className='content'>
                            <TipsManager 
                                handleModal={handleModal} 
                                tips={tips}
                                tipsTotal={tipsTotal}
                            />
                        </div>
                    </section>

                    <section>
                    <div className='nav'>
                            <span className='title'>Payouts</span>
                            <Button type='constructive' clickEvent={() => handleAttendingModal(true)}>Add Staff</Button>
                        </div>

                        <div className='content'>
                            <AttendingStaff 
                                staff={staff} 
                                handleModal={handleModal} 
                                tips={tips}
                                tipsTotal={tipsTotal}
                                ordersTotal={ordersTotal} 
                            />
                        </div>
                    </section>
                </div>

                <div className='column'>
                    <section>
                        <div className='nav'>
                            <span className='title'>Receipts</span>

                            <Dropdown onChangeEvent={({ target }) => {setSelectedFilter(target.selectedIndex)}}>
                                 {
                                    receiptFilters.map(filter => (
                                        <DropdownItem>{filter.title}</DropdownItem>
                                    ))
                                 }
                            </Dropdown>
                        </div>

                        <div className='content'>
                            <ReceiptManager 
                                selectedFilter={selectedFilter}
                                receiptFilters={receiptFilters}
                                setIsBlurred={setIsBlurred}
                                handleModal={handleModal}
                                archivedSessions={archivedSessions}
                                sections={sections}
                                total={0}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}