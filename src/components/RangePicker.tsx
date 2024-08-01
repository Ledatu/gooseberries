import {RangeCalendar} from '@gravity-ui/date-components';
import {Button, Card, Popup, Text} from '@gravity-ui/uikit';
import React, {useState} from 'react';

export const RangePicker = ({args}) => {
    const {recalc, dateRange, setDateRange, anchorRef} = args;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [rangePickerOpen, setRangePickerOpen] = useState(false);

    const [startDate, endDate] = dateRange;

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
                open={rangePickerOpen}
                anchorRef={anchorRef}
                onClose={() => recalc(dateRange)}
                // placement="bottom-end"
            >
                <Card
                    view="outlined"
                    theme="warning"
                    style={{
                        background: 'var(--g-color-base-background)',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        paddingLeft: 20,
                        height: 250,
                        width: 600,
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
                                    const diff = today.getDate() - day - 7 + (day === 0 ? -6 : 1); // adjust when day is Sunday (0)
                                    startOfPreviousWeek.setDate(diff);

                                    // Calculate the end of the previous week (Sunday)
                                    const endOfPreviousWeek = new Date(startOfPreviousWeek);
                                    endOfPreviousWeek.setDate(startOfPreviousWeek.getDate() + 6); // Set to the last day of the previous week (Sunday)

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

                                    const range = [firstDayOfPreviousMonth, lastDayOfPreviousMonth];
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
                    <div style={{width: '70%'}}>
                        <RangeCalendar
                            size="m"
                            timeZone="Europe/Moscow"
                            onUpdate={(val) => {
                                const range = [val.start.toDate(), val.end.toDate()];
                                setDateRange(range);
                                setRangePickerOpen(false);
                                recalc(range);
                            }}
                        />
                    </div>
                </Card>
            </Popup>
        </div>
    );
};
