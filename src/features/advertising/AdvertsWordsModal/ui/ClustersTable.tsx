'use client';

import TheTable from '@/components/TheTable';
import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {Button, Icon, Text, useTheme} from '@gravity-ui/uikit';
import {CSSProperties, ReactNode, useMemo} from 'react';
import {ArrowShapeUp, Magnifier, Minus, Plus, TriangleExclamation} from '@gravity-ui/icons';
import {useClustersTableContext} from '../hooks/ClustersTableContext';
import {renderGradNumber} from '@/utilities/renderGradNumber';
import {defaultRender, renderAsPercent} from '@/utilities/getRoundValue';
import {RangePicker} from '@/components/RangePicker';
import {RequestPhrasesModal} from './RequestPhrasesModal/RequestPhrasesModal';
import {ParsePositionButton} from './ParsePositionButton/ParsePositionButton';
import {ParsePositionMassButton} from './ParsePositionButton/ParsePositionMassButton';
export interface ColumnData {
    placeholder: string;
    name: string;
    additionalNodes?: ReactNode[];
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
        stats,
        filters,
        setFilters,
        excludedStats,
        setCurrentModule,
        currentModule,
    } = useAdvertsWordsModal();

    const {
        data,
        footerData,
        filteredData,
        filterTableData,
        filterByButton,
        // getInfoForDescription,
    } = useClustersTableContext(isExcluded);
    const presetsInOtherTable = useMemo(
        () =>
            (isExcluded ? stats : excludedStats).reduce((obj, entry): any => {
                if (!obj[entry?.preset]) obj[entry?.preset] = true;
                return obj;
            }, {} as any),
        [data],
    );

    const columnData: ColumnData[] = [
        {
            placeholder: 'Кластер',
            name: 'cluster',
            valueType: 'text',
            additionalNodes: [
                <div style={{minWidth: 8}} />,
                <ParsePositionMassButton filteredData={filteredData} />,
            ],
            render: ({value, row, footer}: any) => {
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

                const errorExclude = presetsInOtherTable[row?.preset?.split('&')?.[0]];

                return !footer ? (
                    <div
                        style={{
                            gap: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <RequestPhrasesModal
                            cluster={value}
                            color={errorExclude ? 'danger' : 'primary'}
                        />
                        <div
                            style={{
                                gap: 8,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            {errorExclude ? (
                                <Button
                                    size="xs"
                                    view="flat-danger"
                                    selected
                                    onClick={() => {
                                        filterByButton(row?.preset, 'preset', 'include');
                                        setCurrentModule(
                                            isExcluded ? 'ActiveClusters' : 'InActiveClusters',
                                        );
                                    }}
                                >
                                    <Icon data={TriangleExclamation} />
                                </Button>
                            ) : (
                                <></>
                            )}
                            <ParsePositionButton phrase={value} />
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
            constWidth: 69,
            placeholder: 'Показы, шт',
            name: 'views',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['views'] / data.length, defaultRender),
        },
        {
            constWidth: 69,
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
            constWidth: 69,
            placeholder: 'CTR, %',
            name: 'ctr',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['ctr'], renderAsPercent),
        },
        {
            constWidth: 69,
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
            constWidth: 69,
            placeholder: 'CPM, ₽',
            name: 'cpm',
        },
        {
            constWidth: 69,
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
            constWidth: 100,
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
            constWidth: 100,
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
            constWidth: 69,
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
            constWidth: 100,
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
            constWidth: 69,
            placeholder: 'CR в корзину, %',
            name: 'openToCartCurrent',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['openToCartCurrent'], renderAsPercent),
        },
        {
            constWidth: 69,
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
            constWidth: 69,
            placeholder: 'ДРР, %',
            name: 'drr',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['drr'], renderAsPercent, 'desc'),
        },
        {
            constWidth: 69,
            placeholder: 'CPO, ₽',
            name: 'cpo',
            render: ({value, footer}) =>
                renderGradNumber({value, footer}, footerData['cpo'], defaultRender, 'desc'),
        },
        {
            placeholder: 'Пресет',
            name: 'preset',
            valueType: 'text',
            constWidth: 69,
            render: ({value}: any) => {
                const isRed = presetsInOtherTable[value?.split('&')?.[0]];

                return (
                    <Button
                        size="xs"
                        view={'flat'}
                        onClick={() => {
                            filterByButton(value, 'preset', 'include');
                            setCurrentModule(
                                isRed
                                    ? isExcluded
                                        ? 'ActiveClusters'
                                        : 'InActiveClusters'
                                    : currentModule,
                            );
                        }}
                    >
                        <Text ellipsis style={{maxWidth: 150}} color={isRed ? 'danger' : 'primary'}>
                            {value}
                        </Text>
                    </Button>
                );
            },
        },
    ];

    const rangeToChoose = [startAdvert, endAdvert];
    const daysInWork = useMemo(() => {
        if (!startAdvert || !endAdvert) return;
        const d1 = new Date(
            startAdvert.getFullYear(),
            startAdvert.getMonth(),
            startAdvert.getDate(),
        );
        const d2 = new Date(endAdvert.getFullYear(), endAdvert.getMonth(), endAdvert.getDate());

        const msPerDay = 1000 * 60 * 60 * 24;
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return diffTime / msPerDay + 1;
    }, [startAdvert, endAdvert]);
    const theme = useTheme();

    return (
        <div
            style={
                {
                    background: theme == 'light' ? '#fff9' : undefined,
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    alignItems: 'center',
                    gap: 16,
                }}
            >
                {daysInWork ? (
                    <Text variant="subheader-2">{`Дней в работе: ${daysInWork}`}</Text>
                ) : (
                    <></>
                )}
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
