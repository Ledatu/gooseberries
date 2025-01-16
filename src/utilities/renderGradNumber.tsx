import {Text} from '@gravity-ui/uikit';
import React from 'react';

export const renderGradNumber = (args, footerValue, renderer) => {
    const {value, footer} = args;
    const color = footer
        ? 'primary'
        : value >= footerValue
        ? 'positive'
        : value >= footerValue / 2
        ? 'warning'
        : 'danger';
    return <Text color={color}>{renderer(args)}</Text>;
};
