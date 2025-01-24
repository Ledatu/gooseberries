import {Text, Icon, IconData, TEXT_VARIANTS} from '@gravity-ui/uikit';
import React from 'react';

interface IconWithTextInterface {
    icon: IconData;
    text: string | number | undefined;
    size?: string | number | undefined;
    variant?: (typeof TEXT_VARIANTS)[number];
}

export const IconWithText = ({icon, text, size, variant}: IconWithTextInterface) => {
    return (
        <Text
            variant={variant}
            style={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: 3,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Icon size={size} data={icon} /> {text}
        </Text>
    );
};
