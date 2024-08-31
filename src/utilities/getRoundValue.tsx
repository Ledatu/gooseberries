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

export const getDateFromLocaleString = (str) => {
    if (!str) return new Date(`2100-01-01T00:00:00.000Z`);
    const date = str;
    const isoDate = date.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1').slice(0, 10);
    const res = new Date(`${isoDate}T00:00:00.000Z`);
    return res;
};

export const getDateFromLocaleMonthName = (monthName, year) => {
    const monthMap = {
        январь: 0,
        февраль: 1,
        март: 2,
        апрель: 3,
        май: 4,
        июнь: 5,
        июль: 6,
        август: 7,
        сентябрь: 8,
        октябрь: 9,
        ноябрь: 10,
        декабрь: 11,
    };

    const monthNumber = monthMap[monthName.toLowerCase()];
    if (monthNumber === undefined) {
        throw new Error('Invalid month name');
    }

    return new Date(year, monthNumber);
};

export const getNormalDateRange = (dateRange) => {
    const res = {};
    res['lbd'] = getLocaleDateString(dateRange[0]);
    res['rbd'] = getLocaleDateString(dateRange[1]);
    return res;
};

export const defaultRender = ({value}: {value?: any}, valueType = 'number') => {
    return typeof value === 'number' && valueType != 'text'
        ? new Intl.NumberFormat('ru-RU').format(value)
        : value;
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

export const renderAsPercent = (args) => {
    const {value} = args;
    if (value === undefined) return undefined;
    return <Text>{defaultRender(args)}%</Text>;
};

export const renderAsDate = ({value}) => {
    if (value === undefined || value == 0) return undefined;
    return <Text>{new Date(value).toLocaleString('ru-RU')}</Text>;
};

export const daysInMonth = function (date) {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return d.getDate();
};

export const getMonth = (inputDate) => {
    const date = new Date(inputDate);
    let str = date.toLocaleString('ru-RU', {
        month: 'long',
    });
    const year = date.getFullYear();
    // Capitalize the first letter
    str = `${str.charAt(0).toUpperCase() + str.slice(1)} ${year}`;
    return str;
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
