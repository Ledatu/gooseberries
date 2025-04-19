import {Button, Card, List, Text} from '@gravity-ui/uikit';
import {Note} from '../types';
import {cx} from '@/lib/utils';
import {CSSProperties, useEffect, useState} from 'react';

interface NotesListProps {
    notes: Note[];
    onClick: (item: Note) => void;
    styleCard?: CSSProperties;
    selectedNoteId?: number;
}

export const NotesList = ({
    notes,
    onClick = (note: Note) => {
        note;
    },
    styleCard,
    selectedNoteId,
}: NotesListProps) => {
    const [itemsList, setItemsList] = useState(notes);
    useEffect(() => {
        console.log(notes);
        setItemsList(notes);
    }, [notes]);
    return (
        <div
            style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
					'.g-text-input_size_l .g-text-input__control-height': 40
                } as CSSProperties
            }
        >
            <Card className={cx('blurred-card')} style={styleCard}>
                <List
                    size="l"
                    itemsHeight={560}
                    items={itemsList}
                    itemHeight={48}
                    filterItem={(filter) => {
                        const filterFunction = (item: Note) => {
                            return item.text.includes(filter);
                        };
                        return filterFunction;
                    }}
                    renderItem={(item) => {
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'center',
                                }}
                            >
                                <Card
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 8,
                                        alignSelf: 'center',
                                        width: '96%',
                                        padding: 8,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text ellipsis>{item.text}</Text>
                                    <Button
                                        selected={item.id === selectedNoteId}
                                        view={
                                            item.color === 'positive'
                                                ? 'outlined-success'
                                                : item.color === 'normal'
                                                  ? 'outlined'
                                                  : `outlined-${item.color}`
                                        }
                                    >
                                        {new Date(item.date).toLocaleDateString('ru-RU')}
                                    </Button>
                                </Card>
                            </div>
                        );
                    }}
                    onItemClick={(item) => {
                        onClick(item);
                    }}
                />
            </Card>
        </div>
    );
};
