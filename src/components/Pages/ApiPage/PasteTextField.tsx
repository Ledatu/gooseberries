'use client';

import {TextInput} from '@gravity-ui/uikit';
import {useState} from 'react';
import {PasteButton} from '@/components/Buttons/PasteButton';

export const PasteTextField = ({onPaste}: any) => {
    const [pastedText, setPastedText] = useState('');
    return (
        <TextInput
            placeholder="Нажмите кнопку, чтобы вставить"
            size="l"
            value={pastedText}
            endContent={
                <PasteButton
                    setPastedText={(value: string) => {
                        setPastedText(value);
                        onPaste(value);
                    }}
                />
            }
        />
    );
};
