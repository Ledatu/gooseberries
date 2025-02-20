import {RangeCalendar} from '@gravity-ui/date-components';
import {Button, Popup, Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {dateTimeParse} from '@gravity-ui/date-utils';
import React, {useRef, useState} from 'react';

export const RangePicker = ({args}) => {
    const {recalc, dateRange, setDateRange, align, translate, rangeToChoose} = args;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [rangePickerOpen, setRangePickerOpen] = useState(false);
    // console.log(rangeToChoose);
    const [minDate, maxDate] = rangeToChoose ?? [undefined, undefined];

    const [startDate, endDate] = dateRange;

    const anchorRef = useRef(null);

    return (
        <div>
            <Button
                ref={anchorRef}
                view="outlined-warning"
                size="l"
                onClick={() => {
                    setRangePickerOpen((val) => !val);
                }}
            >
                <Text variant="subheader-1">
                    {`${startDate.toLocaleDateString('ru-RU')} - ${endDate.toLocaleDateString(
                        'ru-RU',
                    )}`}
                </Text>
            </Button>
            <Popup
                offset={[-4, 4]}
                open={rangePickerOpen}
                anchorRef={anchorRef}
                onClose={() => recalc(dateRange)}
                placement={'bottom-end'}
                // placement="bottom-end"
            >
                <div
                    style={{
                        width: 0,
                        height: 0,
                        position: 'relative',
                    }}
                >
                    <motion.div
                        transition={{duration: 0.3}}
                        animate={{
                            opacity: rangePickerOpen ? 1 : 0,
                        }}
                        style={{
                            opacity: 0,
                            display: 'flex',
                            flexDirection: align ?? 'row',
                            alignItems: 'center',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            justifyContent: 'center',
                            boxShadow: '#0006 0px 2px 8px 0px',
                            borderRadius: 30,
                            border: '1px solid #eee2',
                            position: 'absolute',
                            left:
                                translate != 'center'
                                    ? align == 'column'
                                        ? 'calc(-50vw - 76px)'
                                        : -617
                                    : -390,
                            width: align == 'column' ? 'calc(100vw - 35px)' : 600,
                            height: align == 'column' ? 500 : 250,
                            padding: align == 'column' ? 10 : undefined,
                            paddingLeft: align == 'column' ? 10 : 20,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'auto',
                                width: '100%',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        setRangePickerOpen(false);
                                        const range = [today, today];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    Сегодня
                                </Button>
                                <div style={{minWidth: 8}} />
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const yesterday = new Date(today);
                                        yesterday.setDate(yesterday.getDate() - 1);
                                        const range = [yesterday, yesterday];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    Вчера
                                </Button>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const today = new Date();

                                        // Calculate the start of the week (Monday)
                                        const startOfWeek = new Date(today);
                                        const day = today.getDay();
                                        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday (0)
                                        startOfWeek.setDate(diff);

                                        // Calculate the end of the week (Sunday)
                                        const endOfWeek = new Date(startOfWeek);
                                        endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the current week (Sunday)

                                        const range = [startOfWeek, endOfWeek];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    Текущая неделя
                                </Button>
                                <div style={{minWidth: 8}} />
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const today = new Date();

                                        // Calculate the start of the previous week (Monday)
                                        const startOfPreviousWeek = new Date(today);
                                        const day = today.getDay();
                                        const diff =
                                            today.getDate() - day - 7 + (day === 0 ? -6 : 1); // adjust when day is Sunday (0)
                                        startOfPreviousWeek.setDate(diff);

                                        // Calculate the end of the previous week (Sunday)
                                        const endOfPreviousWeek = new Date(startOfPreviousWeek);
                                        endOfPreviousWeek.setDate(
                                            startOfPreviousWeek.getDate() + 6,
                                        ); // Set to the last day of the previous week (Sunday)

                                        const range = [startOfPreviousWeek, endOfPreviousWeek];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    Предыдущая неделя
                                </Button>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const today = new Date();
                                        const startOfMonth = new Date(
                                            today.getFullYear(),
                                            today.getMonth(),
                                            1,
                                        ); // Set to the first day of the current month
                                        const endOfMonth = new Date(
                                            today.getFullYear(),
                                            today.getMonth() + 1,
                                            0,
                                        ); // Set to the last day of the current month

                                        const range = [startOfMonth, endOfMonth];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    Текущий месяц
                                </Button>
                                <div style={{minWidth: 8}} />
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const today = new Date();
                                        const firstDayOfPreviousMonth = new Date(
                                            today.getFullYear(),
                                            today.getMonth() - 1,
                                            1,
                                        ); // First day of the previous month
                                        const lastDayOfPreviousMonth = new Date(
                                            today.getFullYear(),
                                            today.getMonth(),
                                            0,
                                        ); // Last day of the previous month

                                        const range = [
                                            firstDayOfPreviousMonth,
                                            lastDayOfPreviousMonth,
                                        ];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    Предыдущий месяц
                                </Button>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const today = new Date();
                                        const startOfYear = new Date(today.getFullYear(), 0, 1); // Set to the first day of the current year
                                        const endOfYear = new Date(today.getFullYear(), 11, 31); // Set to the last day of the current year

                                        const range = [startOfYear, endOfYear];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    Текущий год
                                </Button>
                                <div style={{minWidth: 8}} />
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const today = new Date();
                                        const startOfPreviousYear = new Date(
                                            today.getFullYear() - 1,
                                            0,
                                            1,
                                        ); // Set to the first day of the previous year
                                        const endOfPreviousYear = new Date(
                                            today.getFullYear() - 1,
                                            11,
                                            31,
                                        ); // Set to the last day of the previous year

                                        const range = [startOfPreviousYear, endOfPreviousYear];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    Предыдущий год
                                </Button>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}
                            >
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const yesterday = new Date(today);
                                        yesterday.setDate(yesterday.getDate() - 1);
                                        const eightDaysAgo = new Date(today);
                                        eightDaysAgo.setDate(eightDaysAgo.getDate() - 7);
                                        const range = [eightDaysAgo, yesterday];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    7 дней
                                </Button>
                                <div style={{minWidth: 8}} />
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const yesterday = new Date(today);
                                        yesterday.setDate(yesterday.getDate() - 1);
                                        const thirtyOneDaysAgo = new Date(today);
                                        thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 30);
                                        const range = [thirtyOneDaysAgo, yesterday];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    30 дней
                                </Button>
                                <div style={{minWidth: 8}} />
                                <Button
                                    width="max"
                                    view="outlined"
                                    onClick={() => {
                                        setRangePickerOpen(false);
                                        const yesterday = new Date(today);
                                        yesterday.setDate(yesterday.getDate() - 1);
                                        const ninetyOneDaysAgo = new Date(today);
                                        ninetyOneDaysAgo.setDate(ninetyOneDaysAgo.getDate() - 90);
                                        const range = [ninetyOneDaysAgo, yesterday];
                                        setDateRange(range);
                                        recalc(range);
                                    }}
                                >
                                    90 дней
                                </Button>
                            </div>
                        </div>
                        <div
                            style={{
                                width: '70%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <RangeCalendar
                                value={{
                                    start: dateTimeParse(new Date(dateRange[0] ?? 0)) as any,
                                    end: dateTimeParse(new Date(dateRange[1] ?? 0)) as any,
                                }}
                                maxValue={maxDate ? dateTimeParse(new Date(maxDate)) : undefined}
                                minValue={minDate ? dateTimeParse(new Date(minDate)) : undefined}
                                size={align == 'column' ? 'l' : 'm'}
                                timeZone="Europe/Moscow"
                                onUpdate={(val) => {
                                    const range = [val.start.toDate(), val.end.toDate()];
                                    setDateRange(range);
                                    setRangePickerOpen(false);
                                    recalc(range);
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </Popup>
        </div>
    );
};
