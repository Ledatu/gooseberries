import {Button, ButtonPin, ButtonSize, ButtonView, Icon, TEXT_COLORS} from '@gravity-ui/uikit';
import {Copy, CopyCheck} from '@gravity-ui/icons';
import React, {ReactNode, useState} from 'react';

interface CopyButtonInterface {
    children?: ReactNode | ReactNode[];
    pin?: ButtonPin;
    view?: ButtonView;
    size?: ButtonSize;
    color?: (typeof TEXT_COLORS)[number];
    iconSize?: number;
    copyText: string;
}

export const CopyButton = ({
    children,
    pin,
    view,
    size,
    color,
    iconSize,
    copyText,
}: CopyButtonInterface) => {
    const [icon, setIcon] = useState({icon: Copy});
    console.log(color);

    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {children}
            <Button
                pin={pin}
                view={view}
                size={size}
                onClick={() => {
                    setIcon({icon: CopyCheck});
                    navigator.clipboard.writeText(copyText);
                    setTimeout(() => {
                        setIcon({icon: Copy});
                    }, 1000);
                }}
                style={{marginLeft: children ? 4 : 0}}
            >
                <Icon data={icon.icon} size={iconSize} />
            </Button>
        </div>
    );
};