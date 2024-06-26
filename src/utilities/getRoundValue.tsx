import {Text, TextInput} from '@gravity-ui/uikit';
import React from 'react';

export const getRoundValue = (a, b, isPercentage = false, def = 0) => {
    let result = b ? a / b : def;
    if (isPercentage) {
        result = Math.round(result * 100 * 100) / 100;
    } else {
        result = Math.round(result);
    }
    return result;
};

export const getLocaleDateString = (date, autoSlice = 10) => {
    const str = date.toLocaleDateString('ru-RU').replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1');

    return autoSlice ? str.slice(0, autoSlice) : str;
};

export const getNormalDateRange = (dateRange) => {
    const res = {};
    res['lbd'] = getLocaleDateString(dateRange[0]);
    res['rbd'] = getLocaleDateString(dateRange[1]);
    return res;
};

export const renderSlashPercent = ({value, row}, key) => {
    const keyVal = row[key];
    if (value === undefined) return undefined;
    const percent = Math.round(((value as number) / keyVal) * 100);
    return (
        <Text>{`${value} ${
            isNaN(percent) || !isFinite(percent) || !value || !keyVal ? '' : '/ ' + percent + '%'
        }`}</Text>
    );
};

export const renderAsPercent = ({value}) => {
    if (value === undefined) return undefined;
    return <Text>{value}%</Text>;
};

export const daysInMonth = function (date) {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return d.getDate();
};

export const getMonthName = (date) => {
    return date.toLocaleString('ru-RU', {
        month: 'short',
    });
};

export const generateTextInputWithNoteOnTop = ({
    value,
    disabled,
    placeholder,
    onUpdateHandler,
    validationState,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Text
                style={{marginLeft: 4}}
                variant="subheader-1"
                color={disabled ? 'secondary' : 'primary'}
            >
                {placeholder}
            </Text>
            <TextInput
                value={value}
                disabled={disabled}
                validationState={validationState ? undefined : 'invalid'}
                onUpdate={onUpdateHandler}
            />
        </div>
    );
};
