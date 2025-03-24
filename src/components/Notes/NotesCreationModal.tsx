'use client';

import {Button, Card, Icon, Modal} from '@gravity-ui/uikit';
import {useEffect, useState} from 'react';
import callApi from '@/utilities/callApi';
import {Check, Eye, PencilToSquare, Xmark} from '@gravity-ui/icons';
import {NotesEditingField} from './NotesEditingField';
import {ShowNotesModal} from './ShowNotesModal';

interface NotesCreationModalProps {
    sellerId: string;
}

export const NotesCreationModal = ({sellerId}: NotesCreationModalProps) => {
    const [notes, setNotes] = useState([] as any);
    const [modalOpen, setModalOpen] = useState(false);
    const getNotes = async () => {
        try {
            const params = {seller_id: sellerId};
            const result = await callApi('get-notes', params);
            if (!result?.data) {
                throw new Error('Error while getting notes');
            }
            const data = result?.data;
            if (!data?.notes) {
                throw new Error('Error while getting notes');
            }
            console.log(data.notes);
            setNotes(data.notes);
        } catch (error) {
            console.error(error);
        }
    };

    const saveNote = async () => {
        try {
            const params = {
                notes: [{seller_id: sellerId, title: title, date: date, text: textNote}],
            };
            const result = await callApi('write-notes', params);
            console.log(result);
            console.log(params);
            // console.log(notes);
        } catch (error) {
            console.error(error);
        }
    };

    const [title, setTitle] = useState('');
    const [textNote, setTextNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [openViewNotes, setOpenViewNotes] = useState(false);
    useEffect(() => {
        console.log('modalIOpen', modalOpen);
        if (modalOpen) {
            getNotes();
            setDate(new Date());
        } else {
            setOpenViewNotes(false);
        }
    }, [modalOpen]);

    return (
        <div>
            <Button
                view="flat"
                size="l"
                onClick={() => {
                    setModalOpen(true);
                    console.log(modalOpen);
                }}
            >
                <Icon data={PencilToSquare} />
            </Button>
            <Modal open={modalOpen}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyItems: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Card
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%,-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minHeight: '300px',
                            // height: 'auto',
                            width: '600px',
                            backdropFilter: 'blur(48px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            borderRadius: 8,
                            border: '1px solid #eee2',
                            position: 'absolute',
                        }}
                    >
                        <div
                            // view="filled"
                            // theme="warning"
                            style={{
                                borderRadius: '8px 8px 0px 0px',
                                margin: '4px',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyItems: 'center',
                                alignContent: 'center',
                                justifyContent: 'space-between',
                                // justifyContent: 'space-between',
                                overflow: 'auto',
                                // backgroundColor: 'rgba(255, 190, 92, 0.2)',
                            }}
                        >
                            <div>
                                <Button
                                    style={{marginLeft: '4px', borderRadius: '4px 4px 4px 4px'}}
                                    size="s"
                                    view="flat-warning"
                                    onClick={() => {
                                        saveNote();
                                    }}
                                >
                                    <Icon data={Check} size={16} />
                                </Button>
                                {/* <Button
                                    style={{
                                        marginLeft: '8px',
                                        borderRadius: '4px 4px 4px 4px',
                                    }}
                                    size="s"
                                    view="flat-warning"
                                    onClick={() => {
                                        setNotes('a');
                                        setTitle('');
                                        setDate(new Date());
                                    }}
                                >
                                    <Icon data={Eraser} size={16} />
                                </Button> */}
                                <Button
                                    onClick={() => setOpenViewNotes(!openViewNotes)}
                                    style={{
                                        marginLeft: '8px',
                                        borderRadius: '4px 4px 4px 4px',
                                    }}
                                    size="s"
                                    view="flat-warning"
                                >
                                    <Icon data={Eye} />
                                </Button>
                            </div>
                            <div>
                                <Button
                                    style={{
                                        marginRight: '8px',
                                        borderRadius: '4px 4px 4px 4px',
                                    }}
                                    size="s"
                                    view="flat-warning"
                                    onClick={() => {
                                        setOpenViewNotes(false);
                                        setModalOpen(false);
                                    }}
                                >
                                    <Icon data={Xmark} />
                                </Button>
                            </div>
                        </div>
                        <NotesEditingField
                            setTitle={setTitle}
                            setText={setTextNote}
                            date={date}
                            text={textNote}
                            title={title}
                        />
                    </Card>
                    <ShowNotesModal open={openViewNotes} notes={notes} />
                </div>
            </Modal>
        </div>
    );
};
