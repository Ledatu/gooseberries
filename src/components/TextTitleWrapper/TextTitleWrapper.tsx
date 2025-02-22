'use client';

import {Children, isValidElement, ReactElement, ReactNode} from 'react';
import {Text, TEXT_VARIANTS} from '@gravity-ui/uikit';

interface TextTitleWrapperInterface {
    children: ReactElement | ReactElement[];
    title: ReactNode;
    padding?: number | undefined;
    style?: object | undefined;
    variant?: (typeof TEXT_VARIANTS)[number];
}

export const TextTitleWrapper = ({
    children,
    title,
    padding,
    style,
    variant,
}: TextTitleWrapperInterface) => {
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const elem = childArray.find((child) => isValidElement(child)) as ReactElement;

    if (!elem) {
        console.error('TextTitleWrapper: No valid React element found in children.');
        return null;
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', ...style}}>
            <Text style={{marginLeft: padding ?? 4}} variant={variant ?? 'subheader-1'}>
                {title}
            </Text>
            {elem}
        </div>
    );
};
