'use client';
import {Text, TextArea} from '@gravity-ui/uikit';
// import {CSSProperties} from 'react';

interface NotesEditingFieldProps {
    date: Date;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setText: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    text: string;
}
export const NotesEditingField = ({
    date,
    setTitle,
    setText,
    title,
    text,
}: NotesEditingFieldProps) => {
    return (
        <div
            style={{
                marginLeft: '8px',
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                // margin: '20px auto',
            }}
        >
            <TextArea
                value={title}
                placeholder="Введите название заметки..."
                onChange={(e) => setTitle(e.target.value)}
                view="clear"
                style={{
                    margin: '0px',
                    '--g-text-body-short-font-size': '24px',
                    '--g-text-body-short-line-height': '1.5',
                    '--g-text-body-font-weight': 600,
                }}
            />
            <Text variant="body-1" color="secondary">
                {new Date(date).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </Text>
            <TextArea
                value={text}
                maxRows={20}
                placeholder="Введите текст заметки..."
                onChange={(e) => setText(e.target.value)}
                view="clear"
            />
        </div>
    );
};
