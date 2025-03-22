'use client';
import {Button, Card, Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
interface Note {
    title: string;
    text: string;
    date: Date;
    index?: number;
}

interface NoteCardProps {
    note: Note;
    setSelectedCard: React.Dispatch<any>;
}

export const ExpandedNoteCard = ({note, setSelectedCard}: NoteCardProps) => {
    return (
        // <motion.div layoutId={`card-${note.index}`}>
        <motion.div layoutId={`card`} style={{boxSizing: 'border-box'}}>
            <Button
                className={'button-card'}
                view="flat"
                style={
                    {
                        flexDirection: 'column',
                        whiteSpace: 'pre-wrap',
                        padding: '0px !important',
                        textAlign: 'justify',
                        height: 'fit-content',
                        display: 'flex',
                    } as React.CSSProperties
                }
                onClick={() => {
                    setSelectedCard(null);
                }}
            >
                <Card
                    style={{
                        padding: '16px',
                        width: '334px',
                        height: '384px',
                        // margin: '8px',
                        backdropFilter: 'blur(48px)',
                        boxShadow: '#0002 0px 2px 8px 0px',
                        borderRadius: 8,
                        border: '1px solid #eee2',
                        overflow: 'scroll',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onClick={() => setSelectedCard(null)}
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
                        whiteSpace="break-spaces"
                        style={{
                            pointerEvents: 'none',
                            margin: '8px',
                            // display: '-webkit-box',
                            // WebkitBoxOrient: 'vertical',
                            // wordWrap: 'break-word', // Break long words
                            // overflowWrap: 'break-word',
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
