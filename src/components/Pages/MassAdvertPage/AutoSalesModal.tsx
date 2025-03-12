'use client';

import {ActionTooltip, Button, Card, Icon, Text} from '@gravity-ui/uikit';
import {Calculator, TagRuble} from '@gravity-ui/icons';
import {useEffect, useMemo, useState} from 'react';
import {RangeCalendar} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';

import callApi from '@/utilities/callApi';
import {motion} from 'framer-motion';
import {TextTitleWrapper} from '@/components/TextTitleWrapper';
import {AutoSalesUploadModal} from './AutoSalesUploadModal';
import {useError} from '@/contexts/ErrorContext';
import {CategoryBar} from '@/lib/CategoryBar/CategoryBar';
import ApiClient from '@/utilities/ApiClient';
import {ModalWindow} from '@/shared/ui/Modal';
// import {getColorClassName} from '@/hooks/chartUtils';

interface ButtonListProps {
    availableAutoSales: any;
    autoSaleName: string[];
    setAutoSaleName: (arg: string[]) => any;
    currentStep: any;
    setCurrentStep: (arg?: any) => any;
    setDateRange: (arg?: any) => any;
}

const ButtonList = ({
    availableAutoSales,
    autoSaleName,
    setAutoSaleName,
    currentStep,
    setCurrentStep,
    setDateRange,
}: ButtonListProps) => {
    let buttons = [] as any[];
    for (const [name, salesData] of Object.entries(availableAutoSales)) {
        const data: any = salesData;
        if (autoSaleName[0] == 'none' || autoSaleName[0] == name)
            buttons.push([
                <motion.div
                    exit={{opacity: 0}}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center',
                    }}
                    animate={{maxWidth: name === autoSaleName[0] ? '250px' : '100%'}}
                >
                    <ActionTooltip title={name}>
                        <Button
                            style={{minWidth: '250px'}}
                            width="max"
                            view="outlined"
                            size="l"
                            onClick={() => {
                                setAutoSaleName(name == autoSaleName[0] ? ['none'] : [name]);
                                setCurrentStep(name == autoSaleName[0] ? 0 : 1);
                                setDateRange([]);
                            }}
                        >
                            {name}
                        </Button>
                    </ActionTooltip>
                    {name == autoSaleName[0] ? (
                        <></>
                    ) : (
                        <Text whiteSpace="nowrap" variant="subheader-2">
                            {`${new Date(data?.['startDateTime'])
                                .toLocaleDateString('ru-RU')
                                .slice(0, 10)} -
                ${new Date(data?.['endDateTime']).toLocaleDateString('ru-RU').slice(0, 10)}`}
                        </Text>
                    )}
                </motion.div>,
                new Date(data?.['startDateTime']).getTime(),
            ]);
    }
    buttons = buttons.sort((a, b) => a[1] - b[1]).map((button) => button[0]);

    return (
        <motion.div
            animate={{height: !currentStep ? 48 * buttons.length : 36}}
            style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                height: 36 * buttons.length + 8 * (buttons.length - 1),
            }}
        >
            {buttons}
        </motion.div>
    );
};

interface AutoSalesModalProps {
    disabled: boolean;
    selectValue: string[];
    filteredData: any;
    setAutoSalesProfits: (arg?: any) => any;
    sellerId: string;
    openFromParent: any;
    setOpenFromParent: (arg?: any) => any;
}

export const AutoSalesModal = ({
    disabled,
    selectValue,
    filteredData,
    setAutoSalesProfits,
    sellerId,
    openFromParent,
    setOpenFromParent,
}: AutoSalesModalProps) => {
    const {showError} = useError();
    const [availableAutoSales, setAvailableAutoSales] = useState<any>({});
    const [availableAutoSalesPending, setAvailableAutoSalesPending] = useState(false);

    const availableAutoSalesOptions = [{content: 'Выберите Акцию', value: 'none'}] as any[];
    for (const [autoSaleName, _] of Object.entries(availableAutoSales)) {
        availableAutoSalesOptions.push({content: autoSaleName, value: autoSaleName});
    }

    const updateInfo = () => {
        if (disabled) return;
        setAvailableAutoSalesPending(true);
        callApi('getPromotions', {
            seller_id: sellerId,
        })
            .then((res) => {
                if (!res) throw 'no response';
                console.log(sellerId, res);

                const sales = res['data'] ?? {};
                console.log('sales', sales);
                setAvailableAutoSales(sales ?? {});
            })
            .catch((error) => {
                showError(error.response?.data?.error || 'An unknown error occurred');
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
    const [autoSaleName, setAutoSaleName] = useState(['']);

    const [dateRange, setDateRange] = useState([] as any[]);
    const [startDate, endDate] = dateRange;
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (autoSalesModalOpen) return;
        console.log(availableAutoSales, availableAutoSalesOptions);
        setCurrentStep(0);
        setAutoSaleName([availableAutoSalesOptions[0] ? availableAutoSalesOptions[0].value : '']);
        setAutoSalesProfits({});
    }, [autoSalesModalOpen]);

    useEffect(() => {
        if (!openFromParent || openFromParent == '') return;
        setCurrentStep(1);
        setAutoSaleName([openFromParent]);
        setAutoSalesModalOpen(true);
        setOpenFromParent('');
    }, [openFromParent]);

    useEffect(() => {
        setDateRange(
            availableAutoSales[autoSaleName[0]]
                ? [
                      new Date(availableAutoSales[autoSaleName[0]].startDateTime),
                      new Date(availableAutoSales[autoSaleName[0]].endDateTime),
                  ]
                : [],
        );
    }, [autoSaleName]);

    const fileRequiredButNotUploaded = useMemo(
        () =>
            availableAutoSales[autoSaleName[0]]?.type == 'auto' &&
            !availableAutoSales[autoSaleName[0]]?.fileUploaded,
        [availableAutoSales, autoSaleName],
    );
    const [currentBoost, setCurrentBoost] = useState<number>(0);

    const currentAutoSale = useMemo(() => {
        console.log(availableAutoSales[autoSaleName[0]], autoSaleName[0]);
        setCurrentBoost(0);
        return availableAutoSales[autoSaleName[0]];
    }, [availableAutoSales, autoSaleName[0]]);

    const rangeValuesOfGoods = useMemo(() => {
        if (!currentAutoSale) return [];
        if (!currentAutoSale?.ranging?.length) return [];
        const sales = currentAutoSale.ranging.map((range: any) => {
            if (currentAutoSale.participationPercentage > range.participationRate)
                setCurrentBoost(range.boost);
            return Math.ceil(
                ((currentAutoSale.inPromoActionLeftovers +
                    currentAutoSale.notInPromoActionLeftovers) *
                    range.participationRate) /
                    100,
            );
        });

        return sales;
    }, [currentAutoSale]);

    const callCalc = async () => {
        const params: any = {
            seller_id: sellerId,
            data: {
                autoSaleName: autoSaleName[0],
                promotion_id: availableAutoSales[autoSaleName[0]].id,
                dateRange,
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

            if (!filters.brands.includes(brand)) filters.brands.push(brand);
            if (!filters.objects.includes(object)) filters.objects.push(object);
            if (!filters.arts.includes(art)) filters.arts.push(art);
        }
        params.data['filters'] = filters;

        console.log(params);

        setAutoSalesModalOpen(false);
        setAvailableAutoSalesPending(true);

        try {
            const res = await ApiClient.post('prices/calc-auto-sale-profit', params);
            console.log(res);
            if (!res || !res['data']) return;
            const profits = res['data'];
            setAutoSalesProfits({...profits});
        } catch (error: any) {
            showError(error?.response?.data?.error || 'Не удалось рассчитать условия акции.');
        }

        setAvailableAutoSalesPending(false);
    };

    const handleClose = () => setAutoSalesModalOpen(false);

    return (
        <>
            <Button
                disabled={disabled}
                view="action"
                loading={availableAutoSalesPending}
                size="l"
                onClick={() => setAutoSalesModalOpen(true)}
            >
                <Icon data={TagRuble} />
                <Text variant="subheader-1">Акции</Text>
            </Button>
            <ModalWindow isOpen={autoSalesModalOpen && !disabled} handleClose={handleClose}>
                <div
                    style={{
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <motion.div
                        // animate={{height: currentStep ? 504 : 36}}
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        transition={{
                            ease: 'easeInOut',
                        }}
                    >
                        <motion.div
                            // animate={{height: currentStep < 3 ? 36 : 0}}
                            // style={{height: 36, overflow: 'hidden', width: '100%'}}
                            transition={{
                                duration: 0.8,
                                type: 'spring',
                                damping: 24,
                                stiffness: 200,
                            }}
                        >
                            <ButtonList
                                setDateRange={setDateRange}
                                availableAutoSales={availableAutoSales}
                                setAutoSaleName={setAutoSaleName}
                                autoSaleName={autoSaleName}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </motion.div>
                        <motion.div
                            animate={{height: currentStep ? 44 : 0}}
                            transition={{
                                duration: 0.8,
                                type: 'spring',
                                damping: 24,
                                stiffness: 200,
                            }}
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
                                style={{width: '100%'}}
                                disabled={disabled}
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
                                        : startDate && endDate && currentStep == 2
                                          ? 'outlined'
                                          : 'outlined-danger'
                                }
                            >
                                <Text variant="subheader-1">
                                    {startDate && endDate && currentStep == 2
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
                            transition={{
                                duration: 0.8,
                                type: 'spring',
                                damping: 24,
                                stiffness: 200,
                            }}
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
                            transition={{
                                duration: 0.8,
                                type: 'spring',
                                damping: 24,
                                stiffness: 200,
                            }}
                            animate={{
                                height: !fileRequiredButNotUploaded && currentStep ? 250 : 0,
                                opacity: !fileRequiredButNotUploaded && currentStep ? 1 : 0,
                            }}
                            style={{
                                overflow: 'hidden',
                                height: 0,
                                opacity: 0,
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
                        {/*  <motion.div
                                transition={{
                                    duration: 0.8,
                                    type: 'spring',
                                    damping: 24,
                                    stiffness: 200,
                                }}
                                animate={{
                                    height: !fileRequiredButNotUploaded && currentStep ? 100 : 0,
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
                                <Checkbox
                                    size="l"
                                    onUpdate={(checked) => {
                                        setSendOborState(checked);
                                    }}
                                    style={{marginBottom: '8px'}}
                                >
                                    <Text>Учитывать обрачиваемость</Text>
                                </Checkbox>
                                {getTextArea()}
                            </motion.div> */}
                        <motion.div
                            animate={{
                                height: currentStep == 2 ? 44 : currentStep == 3 ? 80 : 0,
                            }}
                            transition={{
                                duration: 0.8,
                                type: 'spring',
                                damping: 24,
                                stiffness: 200,
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
                                pin="circle-circle"
                                size="xl"
                                view="action"
                                disabled={!startDate || !endDate}
                                onClick={callCalc}
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
                            maxHeight: 0,
                            overflow: currentStep ? undefined : 'hidden',
                        }}
                        animate={{
                            width: currentStep ? 555 : 0,
                            maxHeight: currentStep ? 1000 : 0,
                            marginRight: currentStep ? 16 : 0,
                        }}
                    >
                        <TextTitleWrapper padding={12} title={'Информация об акции:'}>
                            <Text variant="body-1" style={{whiteSpace: 'pre-wrap', marginLeft: 4}}>
                                {availableAutoSales[autoSaleName[0]] ? (
                                    availableAutoSales[autoSaleName[0]].description
                                ) : (
                                    <></>
                                )}
                            </Text>
                        </TextTitleWrapper>
                        <div style={{minHeight: 16}} />
                        {/* <Text variant='subheader-1'>{`Уже участвующие в акции товары: ${currentAutoSale?.participationPercentage}%`}</Text> */}
                        <TextTitleWrapper
                            // padding={12}
                            title={`Уже участвующие в акции товары: ${currentAutoSale?.participationPercentage}%`}
                            style={{
                                width: '100%',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    margin: '8px',
                                }}
                            >
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <Text variant="subheader-1">
                                        {currentAutoSale?.inPromoActionTotal} товаров участвуют
                                    </Text>
                                    <Text variant="body-1">
                                        {currentAutoSale?.inPromoActionLeftovers} из них с остатками
                                    </Text>
                                    <Text></Text>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'end',
                                        }}
                                    >
                                        <Text variant="subheader-1">
                                            {currentAutoSale?.notInPromoActionTotal} товаров не
                                            участвуют
                                        </Text>
                                        <Text variant="body-1">
                                            {currentAutoSale?.notInPromoActionLeftovers} из них с
                                            остатками
                                        </Text>
                                        <Text></Text>
                                    </div>
                                </div>
                            </div>
                        </TextTitleWrapper>
                        {currentAutoSale?.ranging?.length ? (
                            <Card
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    margin: '8px',
                                    width: '100%',
                                    padding: '8px',
                                }}
                            >
                                <div
                                    style={{
                                        margin: '8px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        // alignItems: 'end',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text variant="subheader-1" color="positive">
                                        Продвижение в поиске и каталоге
                                    </Text>
                                    <Text variant="subheader-1" color="positive">
                                        +{currentBoost}% к выдаче
                                    </Text>
                                </div>
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        margin: '8px',
                                    }}
                                >
                                    {!rangeValuesOfGoods || !rangeValuesOfGoods[0] ? (
                                        <div>
                                            <Text variant="subheader-1">
                                                У вас нет товаров в остатках, которые могли бы
                                                участвовать в акции
                                            </Text>
                                        </div>
                                    ) : (
                                        <CategoryBar
                                            isSameParts={true}
                                            values={rangeValuesOfGoods}
                                            footerValues={currentAutoSale.ranging.map(
                                                (range: any) => range.boost,
                                            )}
                                            marker={{
                                                value: currentAutoSale?.inPromoActionLeftovers,
                                                showAnimation: true,
                                            }}
                                            className="mx-auto max-w-sm"
                                        />
                                    )}
                                </div>
                            </Card>
                        ) : undefined}
                        <div style={{minHeight: 16}} />
                        <TextTitleWrapper padding={12} title={'Преимущества:'}>
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
                                        (advantage: any) => (
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
                                    <Text color="secondary">Нет дополнительных преимуществ</Text>
                                )}
                            </div>
                        </TextTitleWrapper>
                    </motion.div>
                </div>
            </ModalWindow>
        </>
    );
};
