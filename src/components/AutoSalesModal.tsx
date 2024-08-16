import {Button, Card, Icon, Modal, Select, Text} from '@gravity-ui/uikit';
import {Calculator, TagRuble} from '@gravity-ui/icons';
import React, {useEffect, useState} from 'react';
import {RangeCalendar} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import callApi, {getUid} from 'src/utilities/callApi';
import {motion} from 'framer-motion';

export const AutoSalesModal = ({params}) => {
    const {
        availableAutoSalesPending,
        selectValue,
        availableAutoSales,
        filteredData,
        setAvailableAutoSalesPending,
        setAutoSalesProfits,
    } = params;

    const availableAutoSalesOptions = [{content: 'Выберите Акцию', value: 'none'}] as any[];
    for (const [autoSaleName, _] of Object.entries(availableAutoSales)) {
        availableAutoSalesOptions.push({content: autoSaleName, value: autoSaleName});
    }

    const [autoSalesModalOpen, setAutoSalesModalOpen] = useState(false);
    const [dateRange, setDateRange] = useState([] as any[]);
    const [startDate, endDate] = dateRange;
    const [autoSaleName, setAutoSaleName] = useState(['']);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        console.log(availableAutoSales, availableAutoSalesOptions);
        setCurrentStep(0);
        setDateRange([]);
        setAutoSaleName([availableAutoSalesOptions[0] ? availableAutoSalesOptions[0].value : '']);
        setAutoSalesProfits({});
    }, [autoSalesModalOpen]);

    return (
        <>
            <Button
                style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                view="action"
                loading={availableAutoSalesPending}
                size="l"
                onClick={() => setAutoSalesModalOpen(true)}
            >
                <Icon data={TagRuble} />
                <Text variant="subheader-1">Рассчитать акции</Text>
            </Button>
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
                        width: 250,
                    }}
                >
                    <motion.div
                        style={{
                            marginTop: 4,
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'none',
                            width: '100%',
                        }}
                    >
                        <motion.div
                            animate={{height: currentStep < 3 ? 36 : 0}}
                            style={{height: 36, overflow: 'hidden', width: '100%'}}
                        >
                            <Select
                                width={'max'}
                                options={availableAutoSalesOptions}
                                value={autoSaleName}
                                size="l"
                                onUpdate={(nextValue) => {
                                    setAutoSaleName(nextValue);
                                    setCurrentStep(nextValue[0] != 'none' ? 1 : 0);
                                }}
                            />
                        </motion.div>
                        <motion.div
                            animate={{height: currentStep ? 44 : 0}}
                            style={{
                                height: 0,
                                overflow: 'hidden',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'end',
                            }}
                        >
                            <Button
                                width="max"
                                size="l"
                                view="outlined"
                                onClick={() => setCurrentStep(2)}
                            >
                                <Text variant="subheader-1">
                                    {startDate && endDate
                                        ? `${startDate.toLocaleDateString(
                                              'ru-RU',
                                          )} - ${endDate.toLocaleDateString('ru-RU')}`
                                        : 'Выберите даты акции'}
                                </Text>
                            </Button>
                        </motion.div>
                        <motion.div
                            animate={{height: currentStep == 2 ? 250 : 0}}
                            style={{
                                overflow: 'hidden',
                                height: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <RangeCalendar
                                minValue={dateTimeParse(
                                    new Date(
                                        availableAutoSales[autoSaleName[0]]
                                            ? availableAutoSales[autoSaleName[0]].startDate
                                            : '',
                                    ),
                                )}
                                maxValue={dateTimeParse(
                                    new Date(
                                        availableAutoSales[autoSaleName[0]]
                                            ? availableAutoSales[autoSaleName[0]].endDate
                                            : '',
                                    ),
                                )}
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
                        </motion.div>
                        <motion.div
                            animate={{height: currentStep == 2 ? 44 : currentStep == 3 ? 80 : 0}}
                            style={{
                                height: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'end',
                                alignItems: 'center',
                            }}
                        >
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

                                        if (!filters.brands.includes(brand))
                                            filters.brands.push(brand);
                                        if (!filters.objects.includes(object))
                                            filters.objects.push(object);
                                        if (!filters.arts.includes(art)) filters.arts.push(art);
                                    }
                                    params.data['filters'] = filters;

                                    console.log(params);

                                    setAutoSalesModalOpen(false);
                                    setAvailableAutoSalesPending(true);
                                    callApi('calcAutoSaleProfit', params, true)
                                        .then((res) => {
                                            console.log(res);
                                            if (!res || !res['data']) return;
                                            const profits = res['data'];
                                            const temp = {};
                                            for (const [art, artData] of Object.entries(profits)) {
                                                temp[art] = artData;
                                            }
                                            setAutoSalesProfits(temp);
                                        })
                                        .finally(() => {
                                            setAvailableAutoSalesPending(false);
                                        });
                                }}
                            >
                                <Icon data={Calculator} />
                                <Text variant="subheader-1">Рассчитать</Text>
                            </Button>
                        </motion.div>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
