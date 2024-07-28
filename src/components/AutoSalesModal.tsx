import {Button, Card, Icon, Modal, Select, Text} from '@gravity-ui/uikit';
import {Calculator} from '@gravity-ui/icons';
import React, {useEffect, useState} from 'react';
import {RangeCalendar} from '@gravity-ui/date-components';
import callApi from 'src/utilities/callApi';

export const AutoSalesModal = ({params}) => {
    const {
        autoSalesModalOpen,
        setAutoSalesModalOpen,
        getUid,
        selectValue,
        availableAutoSales,
        filteredData,
        setAutoSalesProfits,
    } = params;

    const availableAutoSalesOptions = [] as any[];
    for (const [autoSaleName, _] of Object.entries(availableAutoSales)) {
        availableAutoSalesOptions.push({content: autoSaleName, value: autoSaleName});
    }

    const [dateRange, setDateRange] = useState([] as any[]);
    const [startDate, endDate] = dateRange;
    const [autoSaleName, setAutoSaleName] = useState(['']);

    useEffect(() => {
        console.log(availableAutoSales, availableAutoSalesOptions);

        setDateRange([]);
        setAutoSaleName([availableAutoSalesOptions[0] ? availableAutoSalesOptions[0].value : '']);
        setAutoSalesProfits({});
    }, [autoSalesModalOpen]);

    return (
        <Modal
            open={autoSalesModalOpen}
            onClose={() => {
                setAutoSalesModalOpen(false);
            }}
        >
            <Card
                view="clear"
                style={{
                    margin: 20,
                    flexWrap: 'nowrap',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'none',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Select
                        options={availableAutoSalesOptions}
                        value={autoSaleName}
                        size="l"
                        onUpdate={(nextValue) => {
                            setAutoSaleName(nextValue);
                        }}
                    />
                    <div style={{minHeight: 8}} />
                    <Button
                        size="l"
                        view="action"
                        disabled={!startDate || !endDate}
                        onClick={() => {
                            const params = {
                                uid: getUid(),
                                campaignName: selectValue[0],
                                data: {autoSaleName: autoSaleName[0], dateRange},
                            };

                            const filters = {
                                brands: [] as string[],
                                objects: [] as string[],
                                arts: [] as string[],
                            };

                            for (let i = 0; i < filteredData.length; i++) {
                                const row = filteredData[i];
                                const {brand, object, art} = row ?? {};

                                if (!filters.brands.includes(brand)) filters.brands.push(brand);
                                if (!filters.objects.includes(object)) filters.objects.push(object);
                                if (!filters.arts.includes(art)) filters.arts.push(art);
                            }
                            params.data['filters'] = filters;

                            console.log(params);

                            setAutoSalesModalOpen(false);
                            callApi('calcAutoSaleProfit', params, true).then((res) => {
                                console.log(res);
                                if (!res || !res['data']) return;
                                const profits = res['data'];
                                const temp = {};
                                for (const [art, artData] of Object.entries(profits)) {
                                    temp[art] = artData;
                                }
                                setAutoSalesProfits(temp);
                            });
                        }}
                    >
                        <Icon data={Calculator} />
                        <Text variant="subheader-1">Рассчитать</Text>
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <RangeCalendar
                        size="m"
                        timeZone="Europe/Moscow"
                        onUpdate={(val) => {
                            let startDate = val.start.toDate();
                            let endDate = val.end.toDate();

                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            if (startDate < today) startDate = today;

                            const autoSaleEndDate = new Date(
                                availableAutoSales[autoSaleName[0]].endDate,
                            );
                            autoSaleEndDate.setHours(23, 59, 59, 999);
                            if (autoSaleEndDate < endDate) endDate = autoSaleEndDate;

                            const range = [startDate, endDate];
                            setDateRange(range);
                        }}
                    />
                    <Text variant="subheader-2" color={startDate && endDate ? 'primary' : 'danger'}>
                        {startDate && endDate
                            ? `${startDate.toLocaleDateString(
                                  'ru-RU',
                              )} - ${endDate.toLocaleDateString('ru-RU')}`
                            : 'Выберите даты автоакции'}
                    </Text>
                </div>
            </Card>
        </Modal>
    );
};
