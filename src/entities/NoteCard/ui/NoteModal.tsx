import {ReactNode, useState} from 'react';
import {Note} from '../types';
import {defaultNote} from '../config/defaultNote';
import {NoteEditCard} from './NoteEditCard';
import {Button, Icon} from '@gravity-ui/uikit';
import {PencilToSquare} from '@gravity-ui/icons';
import {deleteNote} from '../api/deleteNote';
import {useCampaign} from '@/contexts/CampaignContext';
import {insertNote} from '../api/insertNote';
import {useError} from '@/contexts/ErrorContext';
import {NotesList} from './NotesList';
import {ModalWindow} from '@/shared/ui/Modal';

interface NotesModalProps {
    open: boolean;
    setOpen: (arg: boolean) => void;
    notes: Note[];
    refetchNotes?: () => void;
    button?: ReactNode;
}

export const NotesModal = ({open, setOpen, notes, refetchNotes, button}: NotesModalProps) => {
    const {sellerId} = useCampaign();
    const {showError} = useError();
    const [selectedNote, setSelectedNote] = useState<Note>(defaultNote(sellerId));

    const handleDeleteButton = async (item: Note) => {
        try {
            if (item.id) {
                await deleteNote(item.id, sellerId);
            }
            const note = defaultNote(sellerId);
            setSelectedNote(note);
            if (refetchNotes) {
                await refetchNotes();
            }
            // setOpen(false);
        } catch (error) {
            console.error(error);
            showError('Ошибка при удалении заметки');
        }
    };
    const handleSaveButton = async (item: Note) => {
        try {
            console.log(item);
            await insertNote(sellerId, item);
            const note = defaultNote(sellerId);
            setSelectedNote(note);
            if (refetchNotes) {
                await refetchNotes();
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            {button ? (
                button
            ) : (
                <Button
                    view="flat"
                    size="l"
                    onClick={() => {
                        refetchNotes ? refetchNotes() : undefined;
                        setOpen(true);
                    }}
                >
                    <Icon data={PencilToSquare} />
                </Button>
            )}
            <ModalWindow isOpen={open} handleClose={() => setOpen(false)}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center',
                        width: 800,
                        height: 600,
                    }}
                >
                    <NoteEditCard
                        note={selectedNote}
                        setNote={setSelectedNote}
                        deleteNote={handleDeleteButton}
                        saveNote={handleSaveButton}
                    />
                    <NotesList
                        selectedNoteId={selectedNote.id}
                        notes={notes}
                        onClick={(item) => {
                            console.log('item', item);
                            setSelectedNote(item);
                        }}
                        styleCard={{width: 300, height: 600}}
                    />
                </div>
            </ModalWindow>
        </div>
    );
};
