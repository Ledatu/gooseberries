import {ModalWindow} from '@/shared/ui/Modal';
import {
    getLocaleDateString,
    renderAsPercent,
    renderSlashPercent,
    defaultRender,
} from '@/utilities/getRoundValue';
import {
    Book,
    CaretDown,
    CaretUp,
    ChartAreaStacked,
    ChevronDownWide,
    // ChevronLeft,
    // ChevronRight,
    ChevronUpWide,
    LayoutList,
    Magnifier,
} from '@gravity-ui/icons';
import {ActionTooltip, Button, Icon, Text, useTheme} from '@gravity-ui/uikit';
import {useState, CSSProperties, useEffect} from 'react';
import {AdvertDateData} from '../types/AdvertDateData';
import {getDefaultAdvertDateData} from '../config/getDefaultAdvertDateData';
import TheTable from '@/components/TheTable';
import {getFilteredStats} from '../hooks/getFilteredStats';
import {getSummaryData} from '../hooks/getSummaryData';
import {getComparison} from '../hooks/getComparison';
import {lessTheBetterStats} from '../config/lessTheBetterStats';
import {moreTheBetterStats} from '../config/moreTheBetterStats';
import {ChartStatsModal} from './ChartStatsModal';
import {motion} from 'framer-motion';

interface AdvertStatsByDayModal {
    data: AdvertDateData[];
    open: boolean;
    setOpen: (arg: boolean) => void;
    customButton?: (props: {onClick: () => void}) => React.ReactNode;
    additionalInfo?: Record<string, {searchStats: AdvertDateData; catalogStats: AdvertDateData}>;
    handleClickDetailedInfoButton?: (date: Date) => {};
    // advertId: number;
}

export const AdvertStatsByDayModal = ({
    data,
    customButton,
    open,
    setOpen,
    additionalInfo,
    handleClickDetailedInfoButton,
}: AdvertStatsByDayModal) => {
    const renderWithAdditionalInfo = (
        date: Date,
        key: string,
        value: number | string,
        isFooter: boolean,
        render?: Function,
    ) => {
        const info = additionalInfo ? additionalInfo[getLocaleDateString(date)] : undefined;
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    alignContent: 'center',
                }}
            >
                {getStatWithArrowButton(value, isFooter, key, date, render)}
                {info ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                        <div>
                            {render
                                ? render({value: info.searchStats[key]})
                                : defaultRender({value: info.searchStats[key]})}
                            <Button size="s" view="flat">
                                <Icon size={12} data={Magnifier} />
                            </Button>
                        </div>
                        <div>
                            {render
                                ? render({value: info.catalogStats[key]})
                                : defaultRender({value: info.catalogStats[key]})}
                            <Button size="s" view="flat">
                                <Icon size={12} data={Book} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    };
    const theme = useTheme();
    const [comparison, setComparison] = useState<{[key: string]: AdvertDateData}>({});
    // const [data, setData] = useState<AdvertDateData[]>([]);
    const [filteredData, setFilteredData] = useState<AdvertDateData[]>([]);
    const [filters, setFilters] = useState<any>({undef: false});
    const [filteredSummary, setFilteredSummary] = useState<{[key: string]: number}>(
        getDefaultAdvertDateData(),
    );

    const getStatWithArrowButton = (
        value: string | number,
        isFooter: boolean,
        key: string,
        date: Date,
        render?: Function,
    ) => {
        if (!key || !date || !comparison) return;
        let button;
        if (!isFooter) {
            const dateString = getLocaleDateString(date as Date);
            if (!comparison[dateString]) return;
            if (comparison[dateString][key] > 0) {
                if (lessTheBetterStats.includes(key)) {
                    button = (
                        <ActionTooltip
                            title={`${Math.round(Math.abs(comparison[dateString][key]) * 100) / 100}`}
                        >
                            {/* <Button view="flat-danger"> */}
                            <Text color="danger">
                                <Icon data={CaretUp} />
                            </Text>
                            {/* </Button> */}
                        </ActionTooltip>
                    );
                } else if (moreTheBetterStats.includes(key)) {
                    button = (
                        <ActionTooltip
                            title={`${Math.round(Math.abs(comparison[dateString][key]) * 100) / 100}`}
                        >
                            <Text color="positive">
                                <Icon data={CaretUp} />
                            </Text>
                        </ActionTooltip>
                    );
                }
            } else if (comparison[dateString][key] < 0) {
                if (lessTheBetterStats.includes(key)) {
                    button = (
                        <ActionTooltip
                            title={`${Math.round(Math.abs(comparison[dateString][key]) * 100) / 100}`}
                        >
                            <Text color="positive">
                                <Icon data={CaretDown} />
                            </Text>
                        </ActionTooltip>
                    );
                } else if (moreTheBetterStats.includes(key)) {
                    button = (
                        <ActionTooltip
                            title={`${Math.round(Math.abs(comparison[dateString][key]) * 100) / 100}`}
                        >
                            <Text color="danger">
                                <Icon data={CaretDown} />
                            </Text>
                        </ActionTooltip>
                    );
                }
            }
        }
        return (
            <div style={{display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                {render ? render({value}) : defaultRender({value})}
                {button}
            </div>
        );
    };

    useEffect(() => {
        if (open && data.length) {
            setComparison(getComparison(data));
            setTimeout(() => {
                filter({}, data);
            }, 500);
        }
    }, [open, data]);

    const filter = (withfFilters: any, stats: AdvertDateData[]) => {
        const tempFilteredData = getFilteredStats(withfFilters ?? filters, stats ?? data);
        setFilteredData(tempFilteredData);
        const summary = getSummaryData(tempFilteredData);
        setFilteredSummary(summary);
    };

    const renderElementOfTable = (
        footer: boolean,
        row: any,
        stat: string,
        value: number | string,
        render?: Function,
    ) => {
        if (footer) return getStatWithArrowButton(value, footer, stat, row['date'], render);
        <motion.div
            layout
            layoutId={`${stat}_${getLocaleDateString(row['date'])}_from`}
            style={{overflow: 'hidden'}}
            transition={{type: 'tween', duration: 0.3, ease: 'easeInOut'}}
        >
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.1}}>
                {getStatWithArrowButton(value, footer, stat, row['date'], render)}
            </motion.div>
        </motion.div>;

        if (row['date'] && additionalInfo && additionalInfo[getLocaleDateString(row['date'])])
            return (
                <motion.div
                    layoutDependency={`${stat}_${getLocaleDateString(row['date'])}_from`}
                    layoutId={`${stat}_${getLocaleDateString(row['date'])}_to`}
                    style={{overflow: 'hidden'}}
                    transition={{type: 'tween', duration: 0.3, ease: 'easeInOut'}}
                >
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.1}}
                    >
                        {renderWithAdditionalInfo(row['date'], stat, value, footer, render)}
                    </motion.div>
                </motion.div>
            );
        return (
            // <motion.div
            //     style={{
            //         overflow: 'hidden',
            //         whiteSpace: 'nowrap',
            //         textOverflow: 'ellipsis',
            //     }}
            //     transition={{type: 'tween', duration: 0.3, ease: 'easeInOut'}}
            //     // layoutDependency={`${stat}_${getLocaleDateString(row['date'])}_to`}
            //     // layoutId={`${stat}_${getLocaleDateString(row['date'])}_from`}
            // >
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.1}}>
                {getStatWithArrowButton(value, footer, stat, row['date'], render)}
                {/* </div> */}
            </motion.div>
            // </motion.div>
        );
    };

    const columnDataArtByDayStats = [
        {
            name: 'date',
            placeholder: 'Дата',
            render: ({value, footer}: any) => {
                if (!value) return;
                if (typeof value === 'number') return `Всего: ${value}`;
                const additionalInfoOfDate = additionalInfo
                    ? additionalInfo[getLocaleDateString(value as Date)]
                    : undefined;
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 4,
                            alignItems: 'center',
                        }}
                    >
                        <Text>{(value as Date).toLocaleDateString('ru-RU').slice(0, 10)}</Text>
                        {handleClickDetailedInfoButton && !footer ? (
                            <Button
                                size="s"
                                view="flat"
                                onClick={() => handleClickDetailedInfoButton(value as Date)}
                            >
                                <Icon
                                    size={12}
                                    data={additionalInfoOfDate ? ChevronUpWide : ChevronDownWide}
                                />
                            </Button>
                        ) : undefined}
                    </div>
                );
            },
        },
        {
            name: 'sum',
            placeholder: 'Расход, ₽',
            render: ({value, footer, row}: any) => {
                return renderElementOfTable(footer, row, 'sum', value);
            },
            // additionalNodes: [
            //     <ChartStatsModal defaultStat='sum' stats={data}>
            //         <Button pin="round-brick" size="xs" view="flat">
            //             <Icon data={ChartAreaStacked} size={16} />
            //         </Button>
            //     </ChartStatsModal>,
            // ],
        },
        {
            name: 'orders',
            placeholder: 'Заказы, шт.',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'orders', row['date']);
            },
        },
        {
            name: 'sumOrders',
            placeholder: 'Заказы, ₽',
            rrender: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'sumOrders', row['date']);
            },
        },
        {
            name: 'profit',
            placeholder: 'Профит, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'profit', row['date']);
            },
        },
        {
            name: 'rent',
            placeholder: 'Рентабельность, %',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'rent', row['date']);
            },
        },
        {
            name: 'avgPrice',
            placeholder: 'Ср. Чек, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'avgPrice', row['date']);
            },
        },
        {
            name: 'drr',
            placeholder: 'ДРР, %',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'drr', row['date'], renderAsPercent);
            },
        },
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'cpo', row['date']);
            },
        },
        {
            name: 'views',
            placeholder: 'Показы, шт.',
            render: ({value, footer, row}: any) => {
                return renderElementOfTable(footer, row, 'views', value);
            },
        },
        {
            name: 'clicks',
            placeholder: 'Клики, шт.',
            render: (args: any) => {
                const {value, footer, row} = args;
                return renderElementOfTable(footer, row, 'clicks', value, ({value}: any) => {
                    return renderSlashPercent({...args, value}, 'openCardCount');
                });
            },
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
            render: (args: any) => {
                const {value, footer, row} = args;
                return renderElementOfTable(footer, row, 'ctr', value, renderAsPercent);
            },
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
            render: ({value, footer, row}: any) => {
                return renderElementOfTable(footer, row, 'cpc', value);
            },
        },
        {
            name: 'cpm',
            placeholder: 'CPM, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'cpm', row['date']);
            },
        },
        {
            name: 'cr',
            placeholder: 'CR из перехода, %',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'cr', row['date'], renderAsPercent);
            },
        },
        {
            name: 'crFromView',
            placeholder: 'CR из показа, %',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(
                    value,
                    footer,
                    'crFromView',
                    row['date'],
                    renderAsPercent,
                );
            },
        },
        {
            name: 'openCardCount',
            placeholder: 'Всего переходов, шт.',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'openCardCount', row['date']);
            },
        },
        {
            name: 'addToCartPercent',
            placeholder: 'CR в корзину, %',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(
                    value,
                    footer,
                    'addToCartPercent',
                    row['date'],
                    renderAsPercent,
                );
            },
        },
        {
            name: 'cartToOrderPercent',
            placeholder: 'CR в заказ, %',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(
                    value,
                    footer,
                    'cartToOrderPercent',
                    row['date'],
                    renderAsPercent,
                );
            },
        },
        {
            name: 'addToCartCount',
            placeholder: 'Корзины, шт.',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'addToCartCount', row['date']);
            },
        },
        {
            name: 'cpl',
            placeholder: 'CPL, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'cpl', row['date']);
            },
        },
    ].map((column) => {
        return {
            ...column,
            additionalNodes: [
                <ChartStatsModal defaultStat={column?.name} stats={data}>
                    <Button pin="brick-brick" size="m" view="flat">
                        <Icon data={ChartAreaStacked} size={16} />
                    </Button>
                </ChartStatsModal>,
            ],
        };
    });

    return (
        <div>
            {customButton ? (
                customButton({onClick: () => setOpen(true)})
            ) : (
                <Button
                    pin="clear-clear"
                    style={{
                        overflow: 'hidden',
                    }}
                    size="xs"
                    view="flat"
                    onClick={() => setOpen(true)}
                >
                    <Icon size={11} data={LayoutList}></Icon>
                </Button>
            )}
            <ModalWindow isOpen={open} handleClose={() => setOpen(false)} padding={false}>
                <div
                    style={
                        {
                            background: theme == 'light' ? '#fff9' : undefined,
                            width: '90vw',
                            height: '70vh',
                            margin: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            '--g-color-base-background':
                                theme === 'dark' ? 'rgba(14, 14, 14, 1)' : '#eeee',
                            gap: 16,
                        } as CSSProperties
                    }
                >
                    <Text variant="header-2">Статистика по дням</Text>
                    <TheTable
                        height={'calc(70vh - 96px)'}
                        columnData={columnDataArtByDayStats}
                        data={filteredData}
                        filters={filters}
                        setFilters={setFilters}
                        filterData={filter}
                        footerData={[filteredSummary]}
                        tableId={'byDateStatsTable'}
                        defaultPaginationSize={50}
                        usePagination={true}
                    />
                </div>
            </ModalWindow>
        </div>
    );
};
