import {useEffect, useState} from 'react';
import {Note} from '../types';
import {useCampaign} from '@/contexts/CampaignContext';
import {getNotes} from '../api/getNotes';
import {useError} from '@/contexts/ErrorContext';

import {NotesModal} from './NoteModal';

export const HeaderNotesModal = () => {
    const {sellerId} = useCampaign();
    const {showError} = useError();
    const [open, setOpen] = useState(false);
    // const [selectedNote, setSelectedNote] = useState<Note>(defaultNote(sellerId));
    const [notes, setNotes] = useState<Note[]>([]);
    const getNotesFunction = async () => {
        try {
            const res = await getNotes(sellerId);
            setNotes(res);
        } catch (error) {
            console.error(error);
            showError('Ошибка при получении заметок');
        }
    };
    useEffect(() => {
        if (open) {
            getNotesFunction();
        }
    }, [open]);

    return (
        <NotesModal open={open} setOpen={setOpen} notes={notes} refetchNotes={getNotesFunction} />
    );
};
