'use client';

import {Text} from '@gravity-ui/uikit';

export const renderGradNumber = (args: any, footerValue: any, renderer: any, mode = 'asc') => {
    const {value, footer} = args;
    const color = footer
        ? 'primary'
        : (mode == 'asc' ? value >= footerValue : value <= footerValue)
          ? 'positive'
          : (mode == 'asc' ? value >= footerValue * 0.7 : value <= footerValue * 1.3)
            ? 'warning'
            : 'danger';
    return <Text color={color}>{renderer(args)}</Text>;
};
