'use client';
import {Button, Card, Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';

import './styles.css';

export interface Note {
    title: string;
    text: string;
    date: Date;
    index?: number;
}

interface NoteCardProps {
    note: Note;
    setSelectedCard: React.Dispatch<any>;
}

export const NoteCard = ({note, setSelectedCard}: NoteCardProps) => {
    return (
        <motion.div
            className="masonry-item"
            style={{boxSizing: 'border-box'}}
            layoutId={`card-${note.index}`}

            // whileHover={{
            //     scale: 1.025,
            //     transition: {
            //         duration: 0.2,
            //     },
            // }}
            // whileTap={{
            //     scale: 0.95,
            // }}
        >
            <Button
                // className="masonry-item"
                className={'button-card'}
                view="flat"
                style={
                    {
                        flexDirection: 'column',
                        whiteSpace: 'pre-wrap',
                        textAlign: 'justify',
                        height: 'fit-content',
                        display: 'flex',
                    } as React.CSSProperties
                }
                onClick={() => {
                    setSelectedCard(note);
                    console.log(note);
                }}
            >
                <Card
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        whiteSpace: 'pre-wrap',
                        height: 'fit-content',
                    }}
                >
                    <Text
                        style={{
                            // cursor: 'default',
                            pointerEvents: 'none',
                            margin: '8px',
                            display: 'inline-block',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                        }}
                        variant="header-1"
                    >
                        {note.title}
                    </Text>
                    <Text
                        style={{margin: '8px', pointerEvents: 'none'}}
                        variant="body-1"
                        color="secondary"
                    >
                        {note.date.toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                    <Text
                        wordBreak="break-all"
                        style={{
                            pointerEvents: 'none',
                            margin: '8px',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 6,
                            overflow: 'hidden',
                            wordWrap: 'break-word', // Break long words
                            overflowWrap: 'break-word',
                        }}
                        // ellipsis={true}
                        variant="body-1"
                    >
                        {note.text}
                    </Text>
                </Card>
            </Button>
        </motion.div>
    );
};
