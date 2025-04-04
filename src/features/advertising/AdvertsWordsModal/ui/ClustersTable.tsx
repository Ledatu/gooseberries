'use client';

import TheTable from '@/components/TheTable';
import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {Button, Icon, Text, useTheme} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {CSSProperties, useState} from 'react';
import {ArrowShapeUp, Magnifier, Minus, Plus} from '@gravity-ui/icons';
import {AnimatedLogo} from '@/components/AnimatedLogo';
import {useClustersTableContext} from '../hooks/ClustersTableContext';
import {renderGradNumber} from '@/utilities/renderGradNumber';
import {defaultRender, renderAsPercent} from '@/utilities/getRoundValue';
import {RangePicker} from '@/components/RangePicker';
import {DescriptionClusterPopup} from './DescriptionClusterPopup';
// import {HelpMark} from '@/components/Popups/HelpMark';

export interface ColumnData {
    placeholder: string;
    name: string;
    valueType?: string;
    constWidth?: number;
    render?: (data: any) => React.ReactNode;
}

export const ClustersTable = () => {
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
        excluded,
    } = useAdvertsWordsModal();

    const columnData: ColumnData[] = [
        {
            placeholder: 'Пресет',
            name: 'preset',
            valueType: 'text',
            constWidth: 100,
            render: ({value}: any) => {
                return (
                    <div>
                        <Button
                            size="xs"
                            view={'flat'}
                            onClick={
                                () => {}
                                // filterByButtonClusters(value, true, 'preset', 'include')
                            }
                        >
                            <Text color="primary">{value}</Text>
                        </Button>
                    </div>
                );
            },
        },
        {
            placeholder: 'Кластер',
            name: 'cluster',
            valueType: 'text',
            render: ({value, footer, row}: any) => {
                const [isSelectedByPlus, setIsSelectedByPlus] = useState<boolean>(
                    template.phrasesSelectedByPlus.includes(value),
                );
                const [isExcludedByMinus, setIsExcludedByMinus] = useState<boolean>(
                    template.phrasesExcludedByMinus.includes(value),
                );
                const isSelectedPhrase = selectedPhrase == value;
                const handlePlusButton = (value: string) => {
                    if (isSelectedByPlus) {
                        advertWordsTemplateHandler.deletePhrasesSelectedByPlus(value);
                        setIsSelectedByPlus(false);
                    } else {
                        advertWordsTemplateHandler.addPhrasesSelectedByPlus(value);
                        setIsSelectedByPlus(true);
                    }
                };

                const handleMinusButton = (value: string) => {
                    if (isExcludedByMinus) {
                        advertWordsTemplateHandler.deletePhrasesExcludedByMinus(value);
                        setIsExcludedByMinus(false);
                    } else {
                        advertWordsTemplateHandler.addPhrasesExcludedByMinus(value);
                        setIsExcludedByMinus(true);
                    }
                };
                return (
                    <div
                        style={{
                            gap: 8,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Button
                            size="xs"
                            view={'flat'}
                            onClick={
                                () => {}
                                // filterByButtonClusters(value, true, 'preset', 'include')
                            }
                        >
                            <Text color="primary">{value}</Text>
                        </Button>
                        {!footer ? (
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
                                    view={isSelectedPhrase ? 'outlined-success' : 'outlined'}
                                    onClick={() => {
                                        updateSelectedPhrase(value);
                                    }}
                                >
                                    <Icon data={ArrowShapeUp} />
                                </Button>
                                <Button
                                    size="xs"
                                    view={isSelectedByPlus ? 'outlined' : 'normal'}
                                    selected={isSelectedByPlus}
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
                                <DescriptionClusterPopup
                                    info={getInfoForDescription(value, row, excluded)}
                                />
                            </div>
                        ) : undefined}
                    </div>
                );
            },
        },
        {
            placeholder: 'Показы, шт',
            name: 'views',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['views'] / data.length,
                            defaultRender,
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'Клики, шт',
            name: 'clicks',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['clicks'] / data.length,
                            defaultRender,
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'CTR, %',
            name: 'ctr',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber({value, footer}, footerData['ctr'], renderAsPercent)}
                    </div>
                );
            },
        },
        {
            placeholder: 'CPC, ₽',
            name: 'cpc',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['cpc'],
                            defaultRender,
                            'desc',
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'Расход, ₽',
            name: 'totalSum',
            render: ({value}) => {
                return <div>{<Text>{value}</Text>}</div>;
            },
        },
        {
            placeholder: 'Частота, шт',
            name: 'totalFrequency',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['totalFrequency'] / data.length,
                            defaultRender,
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'Переходы, шт',
            name: 'openCardCurrent',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['openCardCurrent'] / data.length,
                            defaultRender,
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'CR в корзину, %',
            name: 'openToCartCurrent',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['openToCartCurrent'],
                            renderAsPercent,
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'CR в заказ, %',
            name: 'cartToOrderCurrent',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['cartToOrderCurrent'],
                            renderAsPercent,
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'CR, %',
            name: 'openToOrderPercent',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['openToOrderPercent'],
                            renderAsPercent,
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'ДРР, %',
            name: 'drr',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['drr'],
                            renderAsPercent,
                            'desc',
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'CPO, ₽',
            name: 'cpo',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['cpo'],
                            defaultRender,
                            'desc',
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'В корзину, шт',
            name: 'addToCartCurrent',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['addToCartCurrent'] / data.length,
                            defaultRender,
                        )}
                    </div>
                );
            },
        },

        {
            placeholder: 'Заказов, шт',
            name: 'ordersCurrent',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['addToCartCurrent'] / data.length,
                            defaultRender,
                        )}
                    </div>
                );
            },
        },
        {
            placeholder: 'Средняя позиция, шт',
            name: 'avgPositionCurrent',
            render: ({value, footer}) => {
                return (
                    <div>
                        {renderGradNumber(
                            {value, footer},
                            footerData['avgPositionCurrent'],
                            defaultRender,
                        )}
                    </div>
                );
            },
        },
    ];
    const {
        data,
        footerData,
        filteredData,
        filterTableData,
        setFilters,
        filters,
        getInfoForDescription,
    } = useClustersTableContext();

    const rangeToChoose = [startAdvert, endAdvert];
    const theme = useTheme();
    return (
        <div
            style={
                {
                    // boxShadow: open ? '#0002 0px 2px 8px 0px' : undefined,
                    background: theme == 'light' ? '#fff9' : undefined,
                    WebkitBackdropFilter: 'blur(12px)',
                    backdropFilter: 'blur(12px)',
                    overflow: 'hidden',
                    margin: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    '--g-color-base-background': theme === 'dark' ? 'rgba(14, 14, 14, 1)' : '#eeee',
                    // alignItems: 'center',
                    gap: 8,
                    // padding: 8,
                    // justifyContent: 'center',
                    height: '100%',
                } as CSSProperties
            }
        >
            <div style={{display: 'flex', justifyContent: 'end'}}>
                <RangePicker
                    args={{
                        recalc: () => {},
                        dateRange: dates,
                        setDateRange: setDates,
                        rangeToChoose,
                    }}
                />
            </div>
            {loading ? (
                <motion.div animate={{opacity: loading ? 1 : 0}}>
                    <AnimatedLogo />
                </motion.div>
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
