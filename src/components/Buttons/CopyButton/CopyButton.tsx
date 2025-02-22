'use client';

import {
    ActionTooltip,
    Button,
    ButtonPin,
    ButtonSize,
    ButtonView,
    Icon,
    TEXT_COLORS,
} from '@gravity-ui/uikit';
import {Copy, CopyCheck} from '@gravity-ui/icons';
import {ReactNode, useState} from 'react';

interface CopyButtonInterface {
    children?: ReactNode | ReactNode[];
    pin?: ButtonPin;
    view?: ButtonView;
    size?: ButtonSize;
    selected?: boolean;
    tooltip?: string;
    color?: (typeof TEXT_COLORS)[number];
    iconSize?: number;
    copyText: Function | string;
}

export const CopyButton = ({
    children,
    pin,
    view,
    size,
    selected,
    tooltip,
    iconSize,
    copyText,
}: CopyButtonInterface) => {
    const [icon, setIcon] = useState({icon: Copy});

    const button = (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {children}
            <Button
                selected={selected}
                pin={pin}
                view={view}
                size={size}
                onClick={() => {
                    setIcon({icon: CopyCheck});
                    navigator.clipboard.writeText(
                        typeof copyText == 'string' ? copyText : copyText(),
                    );
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
    return tooltip ? <ActionTooltip title={tooltip}>{button}</ActionTooltip> : button;
};
