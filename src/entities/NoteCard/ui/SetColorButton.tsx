'use client';

import {Button, CSSProperties} from '@gravity-ui/uikit';
import {Color} from '../types/Color';
import {colors} from '../config/colors';

export interface SetColorButtonProps {
    color: Color;
    setColor?: (color: Color) => any;
    style?: CSSProperties;
}

export const SetColorButton = ({color, setColor, style}: SetColorButtonProps) => {
    return (
        <Button
            style={{backgroundColor: colors[color], ...style}}
            onClick={() => {
                setColor ? setColor(color) : undefined;
            }}
        />
    );
};
