'use client';

import TheTable from '@/components/TheTable';
import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {Button, Icon, Text, useTheme} from '@gravity-ui/uikit';
import {CSSProperties, useEffect} from 'react';
import {ArrowShapeUp, Magnifier, Minus, Plus} from '@gravity-ui/icons';
import {useClustersTableContext} from '../hooks/ClustersTableContext';
import {renderGradNumber} from '@/utilities/renderGradNumber';
import {defaultRender, renderAsPercent} from '@/utilities/getRoundValue';
import {RangePicker} from '@/components/RangePicker';
import {RequestPhrasesModal} from './RequestPhrasesModal/RequestPhrasesModal';
export interface ColumnData {
    placeholder: string;
    name: string;
    valueType?: string;
    constWidth?: number;
    render?: (data: any) => React.ReactNode;
}

export interface ClustersTableProps {
    isExcluded: boolean;
}

export const ClustersTable = ({isExcluded}: ClustersTableProps) => {
    const {
        loading,
        advertWordsTemplateHandler,
        template,
        endAdvert,
        startAdvert,
        setDates,
        dates,
        selectedPhrase,
        updateSelectedPhrase,
    } = useAdvertsWordsModal();

    const {
        data,
        footerData,
        filteredData,
        filterTableData,
        setFilters,
        filters,
        filterByButton,
        // getInfoForDescription,
    } = useClustersTableContext(isExcluded);

    const columnData: ColumnData[] = [
        {
            placeholder: 'Кластер',
            name: 'cluster',
            valueType: 'text',
            render: ({value, footer}: any) => {
                const isSelectedByPlus = template.phrasesSelectedByPlus.includes(value);
                const isExcludedByMinus = template.phrasesExcludedByMinus.includes(value);
                const isSelectedPhrase = selectedPhrase == value;
                const handlePlusButton = (value: string) => {
                    if (isSelectedByPlus) {
                        advertWordsTemplateHandler.deletePhrasesSelectedByPlus(value);
                    } else {
                        advertWordsTemplateHandler.addPhrasesSelectedByPlus(value);
                        advertWordsTemplateHandler.deletePhrasesExcludedByMinus(value);
                    }
                };

                const handleMinusButton = (value: string) => {
                    if (isExcludedByMinus) {
                        advertWordsTemplateHandler.deletePhrasesExcludedByMinus(value);
                    } else {
                        advertWordsTemplateHandler.addPhrasesExcludedByMinus(value);
                        advertWordsTemplateHandler.deletePhrasesSelectedByPlus(value);
                    }
                };
                return !footer ? (
                    <div
                        style={{
                            gap: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <RequestPhrasesModal cluster={value} />
                        <div style={{gap: 8, display: 'flex', flexDirection: 'row'}}>
                            <Button
                                size="xs"
                                view="outlined"
                                href={`https://www.wildberries.ru/catalog/0/search.aspx?search=${value}`}
                                target="_blank"
                            >
                                <Icon data={Magnifier} />
                            </Button>
                            <Button
                                size="xs"
                                selected={isSelectedPhrase}
                                view={isSelectedPhrase ? 'outlined-success' : 'outlined'}
                                onClick={() => {
                                    updateSelectedPhrase(value);
                                }}
                            >
                                <Icon data={ArrowShapeUp} />
                            </Button>
                            <Button
                                size="xs"
                                selected={isSelectedByPlus && !isExcludedByMinus}
                                onClick={() => {
                                    handlePlusButton(value);
                                }}
                            >
                                <Icon data={Plus} />
                            </Button>
                            <Button
                                size="xs"
                                view={isExcludedByMinus ? 'outlined-danger' : 'normal'}
                                selected={isExcludedByMinus}
                                onClick={() => {
                                    handleMinusButton(value);
                                }}
                            >
                                <Icon data={Minus} />
                            </Button>
                            {/* <DescriptionClusterPopup
                                    info={getInfoForDescription(value, row, excluded)}
                                /> */}
                        </div>
                    </div>
                ) : (
                    value
                );
            },
        },
        {
            placeholder: 'Пресет',
            name: 'preset',
            valueType: 'text',
            constWidth: 100,
            render: ({value}: any) => {
                return (
                    <Button
                        size="xs"
                        view={'flat'}
                        onClick={() => {
                            filterByButton(value, 'preset', 'include');
                        }}
                    >
                        <Text ellipsis style={{maxWidth: 150}} color="primary">
                            {value}
                        </Text>
                    </Button>
                );
            },
        },
        {
            placeholder: 'Показы, шт',
            name: 'views',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['views'] / data.length, defaultRender),
        },
        {
            placeholder: 'Клики, шт',
            name: 'clicks',
            render: ({value, footer}) =>
                renderGradNumber(
                    {value, footer},
                    footerData['clicks'] / data.length,
                    defaultRender,
                ),
        },
        {
            placeholder: 'CTR, %',
            name: 'ctr',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['ctr'], renderAsPercent),
        },
        {
            placeholder: 'CPC, ₽',
            name: 'cpc',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['cpc'], defaultRender, 'desc'),
        },
        {
            placeholder: 'Расход, ₽',
            name: 'totalSum',
        },
        {
            placeholder: 'ДРР, %',
            name: 'drr',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['drr'], renderAsPercent, 'desc'),
        },
        {
            placeholder: 'CPO, ₽',
            name: 'cpo',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['cpo'], defaultRender, 'desc'),
        },
        {
            placeholder: 'CR, %',
            name: 'openToOrderPercent',
            render: ({value, footer}) =>
                renderGradNumber(
                    {value, footer},
                    footerData['openToOrderPercent'],
                    renderAsPercent,
                ),
        },
        {
            placeholder: 'CR в корзину, %',
            name: 'openToCartCurrent',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['openToCartCurrent'], renderAsPercent),
        },
        {
            placeholder: 'CR в заказ, %',
            name: 'cartToOrderCurrent',
            render: ({value, footer}) =>
                renderGradNumber(
                    {value, footer},
                    footerData['cartToOrderCurrent'],
                    renderAsPercent,
                ),
        },
        {
            placeholder: 'Переходы, шт',
            name: 'openCardCurrent',
            render: ({value, footer}) =>
                renderGradNumber(
                    {value, footer},
                    footerData['openCardCurrent'] / data.length,
                    defaultRender,
                ),
        },
        {
            placeholder: 'В корзину, шт',
            name: 'addToCartCurrent',
            render: ({value, footer}) =>
                renderGradNumber(
                    {value, footer},
                    footerData['addToCartCurrent'] / data.length,
                    defaultRender,
                ),
        },
        {
            placeholder: 'Заказов, шт',
            name: 'ordersCurrent',
            render: ({value, footer}) =>
                renderGradNumber(
                    {value, footer},
                    footerData['addToCartCurrent'] / data.length,
                    defaultRender,
                ),
        },
        {
            placeholder: 'Частота, шт',
            name: 'totalFrequency',
            render: ({value, footer}) =>
                renderGradNumber(
                    {value, footer},
                    footerData['totalFrequency'] / data.length,
                    defaultRender,
                ),
        },
        {
            placeholder: 'Ср. Позиция',
            name: 'avgPositionCurrent',
            render: ({value, footer}) =>
                renderGradNumber(
                    {value, footer},
                    footerData['avgPositionCurrent'],
                    defaultRender,
                    'desc',
                ),
        },
    ];

    const rangeToChoose = [startAdvert, endAdvert];
    useEffect(() => {
        console.log('dates', dates);
    }, [dates]);
    const theme = useTheme();
    return (
        <div
            style={
                {
                    background: theme == 'light' ? '#fff9' : undefined,
                    WebkitBackdropFilter: 'blur(12px)',
                    backdropFilter: 'blur(12px)',
                    overflow: 'hidden',
                    margin: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    '--g-color-base-background': theme === 'dark' ? 'rgba(14, 14, 14, 1)' : '#eeee',
                    gap: 16,
                    height: '100%',
                } as CSSProperties
            }
        >
            <div style={{display: 'flex', justifyContent: 'end'}}>
                <RangePicker
                    args={{
                        recalc: () => {},
                        dateRange: dates[0] && dates[1] ? dates : [new Date(), new Date()],
                        setDateRange: setDates,
                        rangeToChoose,
                    }}
                />
            </div>
            {loading ? (
                <></>
            ) : (
                <TheTable
                    data={filteredData}
                    tableId="ActiveClustersTable"
                    usePagination={true}
                    defaultPaginationSize={100}
                    columnData={columnData}
                    filters={filters}
                    footerData={[footerData]}
                    setFilters={setFilters}
                    filterData={filterTableData}
                    height={'95%'}
                />
            )}
        </div>
    );
};
