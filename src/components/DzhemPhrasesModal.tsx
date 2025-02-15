import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Modal, Text, Loader, Button, Card, ActionTooltip} from '@gravity-ui/uikit';
import TheTable, {compare} from './TheTable';
import ApiClient from 'src/utilities/ApiClient';
// import ApiClient from 'src/utilities/ApiClient';
import {renderGradNumber} from 'src/utilities/renderGradNumber';
import {defaultRender, getRoundValue, renderAsPercent} from 'src/utilities/getRoundValue';
import {RangePicker} from './RangePicker';
import {getMedian} from 'src/utilities/getMedian';

interface DzhemModalProps {
    open: boolean;
    onClose: () => void;
    sellerId: String;
    nmId: Number;

    // dzhemDataFilter: (filter: any, data: any) => void;
    // columnDataDzhem: any[];
    // dzhemDataFilteredData: any[];
    // dzhemDataFilteredSummary: any;
}

const DzhemModal: React.FC<DzhemModalProps> = ({
    open,
    onClose,
    sellerId,
    nmId,
    // dateRange,
    // dzhemDataFilter,
    // dzhemDataFilteredData,
    // dzhemDataFilteredSummary,
}) => {
    const themeVal = localStorage.getItem('theme');
    const initialTheme =
        themeVal !== 'undefined' && themeVal !== 'null' && themeVal ? JSON.parse(themeVal) : 'dark';

    const [dzhemDataFilters, setDzhemDataFilters] = useState({undef: false});
    const [dzhem, setDzhem] = useState<[]>(undefined as any);
    const [load, setLoad] = useState<boolean>(true);
    const [selectedPeriod, setSelectedPeriod] = useState(7);
    const [rangeAvailable, setRangeAvailable] = useState([undefined, undefined] as any[]);
    const [selectedDateRange, setSelectedDateRange] = useState([] as any);
    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() - (today.getHours() > 3 ? 1 : 2));
        today.setHours(23, 59, 59, 0);
        const oldDate = new Date(today);
        oldDate.setHours(0, 0, 0, 0);
        oldDate.setDate(oldDate.getDate() - selectedPeriod);
        setSelectedDateRange([oldDate, today]);
    }, []);

    const setOldDate = (value) => {
        const today = new Date(rangeAvailable[1]);
        today.setHours(23, 59, 59, 0);
        console.log('TODAY', today);
        const oldDate = new Date(rangeAvailable[1]);
        oldDate.setHours(0, 0, 0, 0);
        oldDate.setDate(oldDate.getDate() - Number(value));
        console.log(today, 'today', oldDate, 'oldDate');
        setSelectedDateRange([oldDate, today]);
        setSelectedPeriod(Number(value));
    };
    const getDzhemData = async () => {
        console.log('selectedDateRange', selectedDateRange);
        if (!selectedDateRange[0] || !selectedDateRange[1]) return;
        try {
            setLoad(true);
            const params = {
                nmId: nmId,
                seller_id: sellerId,
                startDate: selectedDateRange[0],
                endDate: selectedDateRange[1],
            };
            console.log('params', params);
            const response = await ApiClient.post('massAdvert/dzhemPhrases', params);
            if (!response?.data) {
                throw new Error('No dzhemPhrases');
            }
            const data = response.data;
            if (!data.dzhemData) {
                throw new Error('No dzhemPhrases');
            }
            setDzhem(response.data.dzhemData);
            setSelectedDateRange(selectedDateRange);
            if (!data.rangeToChoose) {
                throw new Error('no range To choose');
            }
            setRangeAvailable(data.rangeToChoose);
            console.log(data.rangeToChoose, rangeAvailable);
            // dzhemDataFilter({frequencyCurrent: {val: '', mode: 'include'}}, dzhem);

            console.log('responseDzhem', nmId, response.data.dzhemPhrases);
        } catch (error) {
            console.error(error);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        getDzhemData();

        console.log(dzhem);
    }, [selectedDateRange]);

    const [dzhemDataFilteredData, setDzhemDataFilteredData] = useState<any[]>([]);
    const [dzhemDataFilteredFooter, setDzhemDataFilteredFooter] = useState({
        text: '',
    });
    const [dzhemDataFilteredAvg, setDzhemDataFilteredAvg] = useState({text: ''});
    const [dzhemDataFilteredMed, setDzhemDataFilteredMed] = useState({text: ''});

    const dzhemDataFilter = (withfFilters: any, stats: any[]) => {
        const _filters = withfFilters ?? dzhemDataFilters;
        const _stats = stats ?? dzhem;
        console.log('_stats', _stats);

        let count = 0;
        const dzhemDataFilteredFooterTemp = {
            frequencyCurrent: 0,
            weekFrequency: 0,
            avgPositionCurrent: 0,
            openCardCurrent: 0,
            openCardPercentile: 0,
            addToCartCurrent: 0,
            openToOrderPercent: 0,
            addToCartPercentile: 0,
            openToCartCurrent: 0,
            openToCartPercentile: 0,
            ordersCurrent: 0,
            ordersPercentile: 0,
            cartToOrderCurrent: 0,
            cartToOrderPercentile: 0,
            visibilityCurrent: 0,
            text: '',
        };
        setDzhemDataFilteredData(
            _stats.filter((stat) => {
                for (const [filterArg, filterData] of Object.entries(_filters)) {
                    if (filterArg == 'undef' || !filterData) continue;
                    if (filterData['val'] == '') continue;
                    else if (!compare(stat[filterArg], filterData)) {
                        return false;
                    }
                }

                for (const [key, val] of Object.entries(stat)) {
                    if (val === undefined) continue;

                    if (key == 'text') continue;
                    dzhemDataFilteredFooterTemp[key] +=
                        isFinite(val as number) && !isNaN(val as number) ? (val as number) : 0;
                }
                count++;

                // dzhemDataFilteredSummaryTemp['date']++;

                return true;
            }),
        );
        const dzhemDataFilteredAvgTemp = {...dzhemDataFilteredFooterTemp};
        console.log('dzhemDataFilteredData', dzhemDataFilteredData);

        for (const key of [
            'frequencyCurrent',
            'weekFrequency',
            'avgPositionCurrent',
            'openCardCurrent',
            'openCardPercentile',
            'addToCartCurrent',
            'addToCartPercentile',
            'openToCartCurrent',
            'openToCartPercentile',
            'ordersCurrent',
            'ordersPercentile',
            'cartToOrderCurrent',
            'cartToOrderPercentile',
            'visibilityCurrent',
        ]) {
            if (
                ![
                    'openCardCurrent',
                    'addToCartCurrent',
                    'ordersCurrent',
                    'frequencyCurrent',
                ].includes(key)
            ) {
                dzhemDataFilteredFooterTemp[key] = getRoundValue(
                    dzhemDataFilteredFooterTemp[key],
                    count,
                );
            }
            dzhemDataFilteredAvgTemp[key] = getRoundValue(dzhemDataFilteredAvgTemp[key], count);
        }
        setDzhemDataFilteredFooter(dzhemDataFilteredFooterTemp);
        setDzhemDataFilteredAvg(dzhemDataFilteredAvgTemp);
        const mediana = getMedian(_stats, dzhemDataFilteredFooterTemp);
        for (const [key, val] of Object.entries(dzhemDataFilteredFooterTemp)) {
            if (typeof val !== 'number') continue;
            if (
                [
                    'openToCartCurrent',
                    'openToOrderPercent',
                    'cartToOrderCurrent',
                    'avgPositionCurrent',
                    'visibilityCurrent',
                ].includes(key)
            ) {
                dzhemDataFilteredFooterTemp[key] = mediana[key];
                continue;
            }
        }
        console.log(dzhemDataFilteredAvg);
        setDzhemDataFilteredMed(mediana as any);
    };

    useEffect(() => {
        if (!load) {
            dzhemDataFilter({frequencyCurrent: {val: '', mode: 'include'}}, dzhem);
        }
    }, [load, dzhem]);
    const columnDataDzhem = [
        {
            placeholder: 'Поисковая фраза',
            name: 'text',
            valueType: 'text',
            render: ({value}) => {
                return (
                    <ActionTooltip title={value ?? ''}>
                        <div style={{maxWidth: 400}}>{value}</div>
                    </ActionTooltip>
                );
            },
        },
        {
            placeholder: 'Переходы, шт.',
            name: 'openCardCurrent',
            render: (args) => {
                return renderGradNumber(
                    args,
                    dzhemDataFilteredMed['openCardCurrent'],
                    defaultRender,
                );
            },
        },
        {
            placeholder: 'CR в корзину, %',
            name: 'openToCartCurrent',
            render: ({value, footer}) => {
                return renderGradNumber(
                    {value: getRoundValue(value, 1), footer},
                    dzhemDataFilteredMed['openToCartCurrent'],
                    renderAsPercent,
                );
            },
        },
        {
            placeholder: 'CR в заказ, %',
            name: 'cartToOrderCurrent',
            render: ({value, footer}) => {
                return renderGradNumber(
                    {value: getRoundValue(value, 1), footer},
                    dzhemDataFilteredMed['cartToOrderCurrent'],
                    renderAsPercent,
                );
            },
        },
        {
            placeholder: 'CR, %',
            name: 'openToOrderPercent',
            render: ({value, footer}) => {
                return renderGradNumber(
                    {value: getRoundValue(value, 1, true), footer},
                    getRoundValue(dzhemDataFilteredMed['openToOrderPercent'], 1, true),
                    renderAsPercent,
                );
            },
        },
        {
            placeholder: 'В корзину, шт.',
            name: 'addToCartCurrent',
            render: (args) => {
                return renderGradNumber(
                    args,
                    dzhemDataFilteredMed['addToCartCurrent'],
                    defaultRender,
                );
            },
        },
        {
            placeholder: 'Заказов, шт.',
            name: 'ordersCurrent',
            render: (args) => {
                return renderGradNumber(args, dzhemDataFilteredMed['ordersCurrent'], defaultRender);
            },
        },
        {
            placeholder: 'Ср. позиция',
            name: 'avgPositionCurrent',
            render: ({value, footer}) => {
                return renderGradNumber(
                    {value: getRoundValue(value, 1), footer},
                    dzhemDataFilteredMed['avgPositionCurrent'],
                    defaultRender,
                    'desc',
                );
            },
        },
        {
            placeholder: 'Видимость, %',
            name: 'visibilityCurrent',
            render: ({value, footer}) => {
                return renderGradNumber(
                    {value: getRoundValue(value, 1), footer},
                    dzhemDataFilteredMed['visibilityCurrent'],
                    renderAsPercent,
                );
            },
        },
        {
            placeholder: 'Частота использования, шт.',
            name: 'frequencyCurrent',
            render: (args) => {
                return renderGradNumber(
                    args,
                    dzhemDataFilteredMed['frequencyCurrent'],
                    defaultRender,
                );
            },
        },
        // {
        //     placeholder: 'Средняя частота за неделю',
        //     name: 'weekFrequency',
        //     render: (args) => {
        //         return renderGradNumber(
        //             args,
        //             dzhemDataFilteredSummary['weekFrequency'],
        //             defaultRender,
        //         );
        //     },
        // },
        // {
        //     placeholder: genTextColumn(['CR в корзину, %', '(пр. период)',
        //     name: 'addToCartPercentile',
        // // },
        // {
        //     placeholder: genTextColumn(['Видимость, %', '(пр. период)',
        //     name: 'visibilityPrev',
        // },
        // {
        //     placeholder: genTextColumn(['Ср. позиция', '(пр. период)',
        //     name: 'avgPositionPrev',
        // },
        // {
        //     placeholder: genTextColumn(['Мед. позиция', '(пр. период)',
        //     name: 'medianPositionPrev',
        // },
        // {
        //     placeholder: genTextColumn(['Переходы, шт.', '(пр. период)',
        //     name: 'openCardCountPrev',
        // },
        // {
        //     placeholder: genTextColumn(['В корзину, шт.', '(пр. период)',
        //     name: 'addToCartCountPrev',
        // },
        // {
        //     placeholder: genTextColumn(['Заказов, шт.', '(пр. период)',
        //     name: 'ordersPrev',
        // },

        // {
        //     placeholder: genTextColumn(['Переходы, шт.', 'лучше, чем у n% КТ конкурентов',
        //     name: 'openCardCountBetterThanN',
        // },
        // {
        //     placeholder: genTextColumn(['В корзину, шт.', 'лучше, чем у n% КТ конкурентов',
        //     name: 'addToCartCountBetterThanN',
        // },
        // {
        //     placeholder: genTextColumn(['Заказы, шт.', 'лучше, чем у n% КТ конкурентов',
        //     name: 'ordersBetterThanN',
        // },
        // {
        //     placeholder: genTextColumn(['Мин. цена со скидкой', '(по размерам)',
        //     name: 'minPriceWithSppBySizes',
        // },
        // {
        //     placeholder: genTextColumn(['Макс. цена со скидкой', '(по размерам)',
        //     name: 'maxPriceWithSppBySizes',
        // },
    ];

    return (
        <Modal open={open} onClose={onClose}>
            <motion.div
                animate={{
                    height: open ? '65em' : 0,
                    boxShadow: open ? '#0002 0px 2px 8px 0px' : undefined,
                    // border: open ? '1px solid #eee2' : 0,
                }}
                style={{
                    // margin: 20,
                    maxWidth: '90vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'absolute',
                    // marginLeft: 'auto',
                    // marginRight: 'auto',
                    top: 0,
                    bottom: 0,
                    margin: 'auto',
                    left: 0,
                    right: 0,
                    borderRadius: 30,

                    // top: '5%',
                    // left: '5%',
                    // boxShadow: open ? '#0002 0px 2px 8px 0px' : undefined,
                    background: initialTheme == 'light' ? '#fff9' : undefined,
                    WebkitBackdropFilter: 'blur(12px)',
                    backdropFilter: 'blur(12px)',
                    overflow: 'hidden',
                    border: open ? '1px solid #eee2' : 0,
                }}
            >
                <motion.div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 8,
                        width: '100%',
                    }}
                >
                    <Text variant="header-2" style={{margin: 16}}>
                        Статистика Джема
                    </Text>
                    <Card style={{marginRight: 8, borderRadius: 8}} theme="warning" size="l">
                        <Button
                            style={{width: 48, height: 35}}
                            selected={selectedPeriod == 7}
                            pin="round-clear"
                            size="l"
                            view="flat-warning"
                            onClick={() => setOldDate('7')}
                        >
                            <Text variant="subheader-1">7</Text>
                        </Button>
                        <Button
                            style={{width: 48, height: 35}}
                            pin="clear-clear"
                            selected={selectedPeriod == 30}
                            size="l"
                            view="flat-warning"
                            onClick={() => setOldDate('30')}
                        >
                            <Text variant="subheader-1">30</Text>
                        </Button>
                        <Button
                            style={{width: 48, height: 35}}
                            pin="clear-round"
                            size="l"
                            view="flat-warning"
                            onClick={() => setOldDate('90')}
                            selected={selectedPeriod == 90}
                        >
                            <Text variant="subheader-1">90</Text>
                        </Button>
                    </Card>
                    {!selectedDateRange[0] || !selectedDateRange[1] ? (
                        <></>
                    ) : (
                        <RangePicker
                            args={{
                                recalc: () => {},
                                dateRange: selectedDateRange,
                                setDateRange: setSelectedDateRange,
                                rangeToChoose: rangeAvailable,
                            }}
                        />
                    )}
                </motion.div>
                {load ? (
                    <motion.div
                        animate={{opacity: dzhem === undefined ? 1 : 0}}
                        style={{margin: '80px'}}
                    >
                        <Loader size="l" />
                    </motion.div>
                ) : dzhem.length != 0 ? (
                    <motion.div
                        style={{width: '100%'}}
                        onAnimationEnd={() =>
                            dzhemDataFilter({frequencyCurrent: {val: '', mode: 'include'}}, dzhem)
                        }
                    >
                        <React.Fragment>
                            <style>
                                {`.data-table_theme_yandex-cloud {
                                    --data-table-color-base: ${
                                        initialTheme == 'dark' ? 'rgba(14, 14, 14, 1)' : '#eeea'
                                    };
                                    --data-table-color-stripe: var(--yc-color-base-generic-ultralight, var(--yc-color-base-area, var(--color-base-area)));
                                    --data-table-border-color: var(--yc-color-base-generic-hover, var(--yc-color-contrast-15-solid, var(--color-contrast-15-solid)));
                                    --data-table-color-hover-area: var(--yc-color-base-simple-hover, var(--yc-color-hover-area, var(--color-hover-area)));
                                    /* --data-table-color-footer-area: var(--data-table-color-base); */}`}
                            </style>
                            <TheTable
                                columnData={columnDataDzhem}
                                data={dzhemDataFilteredData}
                                filters={dzhemDataFilters}
                                setFilters={setDzhemDataFilters}
                                filterData={dzhemDataFilter}
                                footerData={[dzhemDataFilteredFooter]}
                                tableId={'dzhemTable'}
                                usePagination={false}
                                width="90vw"
                                height="calc(65em - 80px)"
                            />
                        </React.Fragment>
                    </motion.div>
                ) : (
                    <Text style={{marginTop: 200}} variant="subheader-3">
                        По данному артикулу информация не выгружалась
                    </Text>
                )}
            </motion.div>
        </Modal>
    );
};

export default DzhemModal;
