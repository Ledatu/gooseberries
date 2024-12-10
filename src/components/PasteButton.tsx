import {
    Button,
    ButtonPin,
    ButtonSize,
    ButtonView,
    Icon,
    TEXT_COLORS,
    Tooltip,
} from '@gravity-ui/uikit';
import {FileCheck, Files} from '@gravity-ui/icons';
import React, {ReactNode, useState} from 'react';

interface PasteButtonInterface {
    children?: ReactNode | ReactNode[];
    pin?: ButtonPin;
    view?: ButtonView;
    size?: ButtonSize;
    selected?: boolean;
    color?: (typeof TEXT_COLORS)[number];
    iconSize?: number;
    setPastedText: Function;
}

export const PasteButton = ({
    children,
    pin,
    view,
    size,
    selected,
    iconSize,
    setPastedText,
}: PasteButtonInterface) => {
    const [icon, setIcon] = useState({icon: Files});

    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {children}
            <Tooltip content={'Нажмите, чтобы вставить'}>
                <Button
                    selected={selected}
                    pin={pin}
                    view={view}
                    size={size}
                    onClick={async () => {
                        setIcon({icon: FileCheck});
                        setPastedText(await navigator.clipboard.readText());
                        setTimeout(() => {
                            setIcon({icon: Files});
                        }, 1000);
                    }}
                    style={{marginLeft: children ? 4 : 0}}
                >
                    <Icon data={icon.icon} size={iconSize} />
                </Button>
            </Tooltip>
        </div>
    );
};
