import {TextInput} from '@gravity-ui/uikit';
import React, {useState} from 'react';
import {PasteButton} from './PasteButton';

export const PasteTextField = ({onPaste}) => {
    const [pastedText, setPastedText] = useState('');
    return (
        <TextInput
            placeholder="Нажмите кнопку, чтобы вставить"
            size="l"
            value={pastedText}
            rightContent={
                <PasteButton
                    setPastedText={(value) => {
                        setPastedText(value);
                        onPaste(value);
                    }}
                />
            }
        />
    );
};
