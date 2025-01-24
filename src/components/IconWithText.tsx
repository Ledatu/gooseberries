import {Text, Icon, IconData, TEXT_VARIANTS, Tooltip} from '@gravity-ui/uikit';
import React from 'react';

interface IconWithTextInterface {
    icon: IconData;
    text: string | number | undefined;
    tooltipText?: string | number | undefined;
    size?: string | number | undefined;
    variant?: (typeof TEXT_VARIANTS)[number];
}

export const IconWithText = ({icon, text, tooltipText, size, variant}: IconWithTextInterface) => {
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
            <Tooltip content={tooltipText}>
                <Icon size={size} data={icon} />
            </Tooltip>
            {text}
        </Text>
    );
};
