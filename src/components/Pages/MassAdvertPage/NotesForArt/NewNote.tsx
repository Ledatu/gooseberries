'use client';

import {useState} from 'react';
// import {Color, colors} from './types';
import {EditNoteForArt} from './EditNoteForArt';
import {Button, Icon, Text} from '@gravity-ui/uikit';
import {Plus} from '@gravity-ui/icons';

interface NewNoteProps {
    nmId: number;
    reloadNotes: (arg: any) => any;
}

export const NewNote = ({nmId, reloadNotes}: NewNoteProps) => {
    // const [currentColor, setCurrentColor] = useState<Color>('normal');
    const [openModal, setOpenModal] = useState<boolean>(false);
    return (
        <>
            <EditNoteForArt
                open={openModal}
                setOpen={setOpenModal}
                nmId={nmId}
                reloadNotes={reloadNotes}
            />
            <Button
                onClick={() => {
                    setOpenModal(true);
                }}
                style={{width: 32, maxHeight: 12, alignItems: 'center'}}
            >
                <Text>
                    <Icon data={Plus} size={12} />
                </Text>
            </Button>
        </>
    );
};
