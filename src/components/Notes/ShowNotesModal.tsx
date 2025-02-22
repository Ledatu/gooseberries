import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Note, NoteCard} from './NoteCard';
import {Card} from '@gravity-ui/uikit';
import './styles.css';
import {ExpandedNoteCard} from './ExpandedNoteCard';
// import Masonry from '@mui/lab/Masonry';
import Masonry from 'react-layout-masonry';

interface ShowNotesModalProps {
    notes: Note[];
    open: boolean;
    // open: boolean;
}

export const ShowNotesModal = ({notes, open}: ShowNotesModalProps) => {
    const [selectedCard, setSelectedCard] = useState(null as any);
    return (
        <motion.div
            style={{
                position: 'absolute',
                padding: '8px',
                borderRadius: '4px',
                transform: `translate(50%, 0%)`,
                opacity: 0,
                // bottom: '-50%',
                // transform: `translate('120%', -50%)`,
            }}
            animate={{
                width: open === true ? 250 : 0,
                opacity: open === true ? 1 : 0,
                transform: open === true ? `translate(120%, 0%)` : `translate(30%, -0%)`,
                // left: open ? 0 : 500,
            }}
        >
            <Card
                style={
                    {
                        position: 'relative',
                        // zIndex: !open ? 0 : 'auto',
                        pointerEvents: open ? 'auto' : 'none',
                        padding: '8px',
                        width: '350px',
                        height: '400px',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '#0002 0px 2px 8px 0px',
                        borderRadius: 8,
                        border: '1px solid #eee2',
                        overflow: 'scroll',
                    } as React.CSSProperties
                }
            >
                {selectedCard ? (
                    <ExpandedNoteCard note={selectedCard} setSelectedCard={setSelectedCard} />
                ) : (
                    // <motion.div layoutId="card">
                    <Masonry columns={2} gap={8}>
                        {notes.map((value) => {
                            console.log(value);
                            return (
                                // <div key={index}>
                                <NoteCard note={value} setSelectedCard={setSelectedCard} />
                                // </div>
                            );
                        })}
                    </Masonry>
                    // </motion.div>
                )}
            </Card>
        </motion.div>
    );
};
