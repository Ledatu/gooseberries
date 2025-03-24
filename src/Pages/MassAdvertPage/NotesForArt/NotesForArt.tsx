'use client';

// import {Popover} from '@gravity-ui/uikit';
// import {SetColorButton} from './SetColorButton';
import {Note} from './types';
import {NoteForArt} from './NoteForArt';
import {NewNote} from './NewNote';

interface NotesForArtProps {
    notes: Note[] | [];
    nmId: number;
    reloadNotes: (arg: any) => any;
}

export const NotesForArt = ({notes, nmId, reloadNotes}: NotesForArtProps) => {
    return (
        <div style={{display: 'flex', flex: 'wrap', flexDirection: 'column'}}>
            {notes.map((note) => (
                <NoteForArt note={note} reloadNotes={reloadNotes} />
            ))}
            {notes.length < 8 ? <NewNote nmId={nmId} reloadNotes={reloadNotes} /> : undefined}
        </div>
    );
};
