'use client';

import {Button, CSSProperties} from '@gravity-ui/uikit';
import {Color, colors} from './types';

export interface SetColorButtonProps {
    color: Color;
    setColor?: (color: Color) => any;
    style?: CSSProperties;
}

export const SetColorButton = ({color, setColor, style}: SetColorButtonProps) => {
    return (
        <Button
            // view={color === 'normal' ? 'normal' : `flat-${color}`}
            style={{backgroundColor: colors[color], ...style}}
            // selected={true}
            // color={color}
            // view={color}
            onClick={() => {
                setColor ? setColor(color) : undefined;
            }}
        />
    );
};
