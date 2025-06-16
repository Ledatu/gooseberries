'use client';

import {Text, Icon, IconData, TEXT_VARIANTS, ActionTooltip} from '@gravity-ui/uikit';

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
            <ActionTooltip title={tooltipText?.toString() ?? ''}>
                <div style={{display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon size={size} data={icon} />
                    {text}
                </div>
            </ActionTooltip>
        </Text>
    );
};
