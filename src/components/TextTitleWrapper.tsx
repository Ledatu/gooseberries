import React, {Children, isValidElement, ReactElement} from 'react';
import {Text} from '@gravity-ui/uikit';

interface TextTitleWrapperInterface {
    children: ReactElement | ReactElement[];
    title: string;
    padding?: number | undefined;
    style?: object | undefined;
}

export const TextTitleWrapper = ({children, title, padding, style}: TextTitleWrapperInterface) => {
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const elem = childArray.find((child) => isValidElement(child)) as ReactElement;

    if (!elem) {
        console.error('TextTitleWrapper: No valid React element found in children.');
        return null;
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>
            <Text style={{marginLeft: padding ?? 4}} variant="subheader-1">
                {title}
            </Text>
            {elem}
        </div>
    );
};
