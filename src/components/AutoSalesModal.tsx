import {Button, Card, Icon, Modal, Select, Text} from '@gravity-ui/uikit';
import {Calculator, TagRuble} from '@gravity-ui/icons';
import React, {useEffect, useMemo, useState} from 'react';
import {RangeCalendar} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import callApi, {getUid} from 'src/utilities/callApi';
import {motion} from 'framer-motion';
import {TextTitleWrapper} from './TextTitleWrapper';
import {AutoSalesUploadModal} from './AutoSalesUploadModal';

export const AutoSalesModal = ({selectValue, filteredData, setAutoSalesProfits, sellerId}) => {
    const [availableAutoSales, setAvailableAutoSales] = useState({});
    const [availableAutoSalesPending, setAvailableAutoSalesPending] = useState(false);
    const availableAutoSalesOptions = [{content: 'Выберите Акцию', value: 'none'}] as any[];
    for (const [autoSaleName, _] of Object.entries(availableAutoSales)) {
        availableAutoSalesOptions.push({content: autoSaleName, value: autoSaleName});
    }

    const updateInfo = () => {
        setAvailableAutoSalesPending(true);
        callApi('getPromotions', {
            seller_id: sellerId,
        })
            .then((res) => {
                if (!res) throw 'no response';
                console.log(res);

                const sales = res['data'] ?? {};
                setAvailableAutoSales(sales ?? {});
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setAvailableAutoSalesPending(false);
            });
    };

    const [uploaded, setUploaded] = useState(false);

    useEffect(() => updateInfo(), [selectValue]);
    useEffect(() => {
        if (!uploaded) return;
        updateInfo();
        setUploaded(false);
    }, [uploaded]);

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

    const fileRequiredButNotUploaded = useMemo(
        () =>
            availableAutoSales[autoSaleName[0]]?.type == 'auto' &&
            !availableAutoSales[autoSaleName[0]]?.fileUploaded,
        [availableAutoSales, autoSaleName],
    );

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
                    }}
                >
                    <motion.div
                        style={{
                            marginTop: 4,
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'none',
                        }}
                    >
                        <motion.div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'none',
                                width: 250,
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
                                        if (nextValue[0] != 'none') setDateRange([]);
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
                                    href={
                                        fileRequiredButNotUploaded
                                            ? `https://seller.wildberries.ru/dp-promo-calendar?action=${
                                                  availableAutoSales[autoSaleName[0]]?.id
                                              }`
                                            : undefined
                                    }
                                    target={fileRequiredButNotUploaded ? '_blank' : undefined}
                                    view={
                                        fileRequiredButNotUploaded
                                            ? 'outlined-action'
                                            : startDate && endDate
                                            ? 'outlined'
                                            : 'outlined-danger'
                                    }
                                >
                                    <Text variant="subheader-1">
                                        {startDate && endDate
                                            ? `${startDate.toLocaleDateString(
                                                  'ru-RU',
                                              )} - ${endDate.toLocaleDateString('ru-RU')}`
                                            : fileRequiredButNotUploaded
                                            ? 'Сформируйте файл здесь'
                                            : 'Выберите даты акции'}
                                    </Text>
                                </Button>
                            </motion.div>
                            <motion.div
                                animate={{
                                    height: fileRequiredButNotUploaded && currentStep ? 36 : 0,
                                    marginTop: fileRequiredButNotUploaded && currentStep ? 8 : 0,
                                }}
                                style={{height: 0, overflow: 'hidden', width: '100%'}}
                            >
                                <AutoSalesUploadModal
                                    selectValue={selectValue}
                                    sellerId={sellerId}
                                    uploaded={uploaded}
                                    setUploaded={setUploaded}
                                    promotion={availableAutoSales[autoSaleName[0]]}
                                />
                            </motion.div>
                            <motion.div
                                animate={{
                                    height: !fileRequiredButNotUploaded && currentStep ? 250 : 0,
                                }}
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
                                    value={{
                                        start: dateTimeParse(new Date(startDate ?? 0)) as any,
                                        end: dateTimeParse(new Date(endDate ?? 0)) as any,
                                    }}
                                    minValue={dateTimeParse(
                                        new Date(
                                            availableAutoSales[autoSaleName[0]]
                                                ? availableAutoSales[autoSaleName[0]].startDateTime
                                                : '',
                                        ),
                                    )}
                                    maxValue={dateTimeParse(
                                        new Date(
                                            availableAutoSales[autoSaleName[0]]
                                                ? availableAutoSales[autoSaleName[0]].endDateTime
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
                                        setCurrentStep(2);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                animate={{
                                    height: currentStep == 2 ? 44 : currentStep == 3 ? 80 : 0,
                                }}
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
                                            data: {
                                                autoSaleName: autoSaleName[0],
                                                dateRange,
                                                seller_id: sellerId,
                                                promotion_id:
                                                    availableAutoSales[autoSaleName[0]].id,
                                            },
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
                                                for (const [art, artData] of Object.entries(
                                                    profits,
                                                )) {
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
                        <motion.div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'none',
                                width: 0,
                                overflow: 'hidden',
                                maxHeight: 0,
                            }}
                            animate={{
                                width: currentStep ? 500 : 0,
                                maxHeight: currentStep ? 1000 : 0,

                                marginRight: currentStep ? 16 : 0,
                            }}
                        >
                            <TextTitleWrapper padding={8} title={'Информация об акции:'}>
                                <Text variant="body-1">
                                    {availableAutoSales[autoSaleName[0]] ? (
                                        availableAutoSales[autoSaleName[0]].description
                                    ) : (
                                        <></>
                                    )}
                                </Text>
                            </TextTitleWrapper>
                            <TextTitleWrapper padding={8} title={'Преимущества:'}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {availableAutoSales[autoSaleName[0]] &&
                                    availableAutoSales[autoSaleName[0]].advantages?.length ? (
                                        availableAutoSales[autoSaleName[0]].advantages.map(
                                            (advantage) => (
                                                <Button
                                                    style={{margin: 4}}
                                                    size="xs"
                                                    pin="circle-circle"
                                                    view="outlined-info"
                                                >
                                                    {advantage}
                                                </Button>
                                            ),
                                        )
                                    ) : (
                                        <Text color="secondary">
                                            Нет дополнительных преимуществ
                                        </Text>
                                    )}
                                </div>
                            </TextTitleWrapper>
                        </motion.div>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
