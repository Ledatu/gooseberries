import {ModalWindow} from '@/shared/ui/Modal';
import {
    getLocaleDateString,
    renderAsPercent,
    renderSlashPercent,
    defaultRender,
} from '@/utilities/getRoundValue';
import {CaretDown, CaretUp, LayoutList} from '@gravity-ui/icons';
import {ActionTooltip, Button, Icon, Text, useTheme} from '@gravity-ui/uikit';
import {useState, CSSProperties, useEffect} from 'react';
// import {AdvertDateDataComparison} from '../types/AdvertDateDataComparison';
import {AdvertDateData} from '../types/AdvertDateData';
import {getDefaultAdvertDateData} from '../config/getDefaultAdvertDateData';
import TheTable from '@/components/TheTable';
import {getFilteredStats} from '../hooks/getFilteredStats';
import {getSummaryData} from '../hooks/getSummaryData';
import {getComparison} from '../hooks/getComparison';
import {lessTheBetterStats} from '../config/lessTheBetterStats';
import {moreTheBetterStats} from '../config/moreTheBetterStats';

interface AdvertStatsByDayModal {
    data: AdvertDateData[];
    open: boolean;
    setOpen: (arg: boolean) => void;
    customButton?: (props: {onClick: () => void}) => React.ReactNode;
    // advertId: number;
}

export const AdvertStatsByDayModal = ({
    data,
    customButton,
    open,
    setOpen,
}: AdvertStatsByDayModal) => {
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
        comparison: {[key: string]: AdvertDateData},
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
            <div style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                {render ? render(value) : defaultRender({value})}
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

    const columnDataArtByDayStats = [
        {
            name: 'date',
            placeholder: 'Дата',
            render: ({value}: any) => {
                if (!value) return;
                if (typeof value === 'number') return `Всего: ${value}`;
                return <Text>{(value as Date).toLocaleDateString('ru-RU').slice(0, 10)}</Text>;
            },
        },
        {
            name: 'sum',
            placeholder: 'Расход, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'sum', row['date'], comparison);
            },
        },
        {
            name: 'orders',
            placeholder: 'Заказы, шт.',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'orders', row['date'], comparison);
            },
        },
        {
            name: 'sumOrders',
            placeholder: 'Заказы, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'sumOrders', row['date'], comparison);
            },
        },
        {
            name: 'profit',
            placeholder: 'Профит, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'profit', row['date'], comparison);
            },
        },
        {
            name: 'rent',
            placeholder: 'Рентабельность, %',
            render: (args: any) => {
                const {value, footer, row} = args;
                return getStatWithArrowButton(value, footer, 'rent', row['date'], comparison, () =>
                    renderAsPercent(args),
                );
            },
        },
        {
            name: 'avgPrice',
            placeholder: 'Ср. Чек, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'avgPrice', row['date'], comparison);
            },
        },
        {
            name: 'drr',
            placeholder: 'ДРР, %',
            render: (args: any) => {
                const {value, footer, row} = args;
                return getStatWithArrowButton(value, footer, 'drr', row['date'], comparison, () =>
                    renderAsPercent(args),
                );
            },
        },
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'cpo', row['date'], comparison);
            },
        },
        {
            name: 'views',
            placeholder: 'Показы, шт.',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'views', row['date'], comparison);
            },
        },
        {
            name: 'clicks',
            placeholder: 'Клики, шт.',
            render: (args: any) => {
                const {value, footer, row} = args;
                return getStatWithArrowButton(
                    value,
                    footer,
                    'clicks',
                    row['date'],
                    comparison,
                    (value: any) => {
                        value;
                        return renderSlashPercent(args, 'openCardCount');
                    },
                );
            },
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
            render: (args: any) => {
                const {value, footer, row} = args;
                return getStatWithArrowButton(value, footer, 'ctr', row['date'], comparison, () =>
                    renderAsPercent(args),
                );
            },
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'cpc', row['date'], comparison);
            },
        },
        {
            name: 'cpm',
            placeholder: 'CPM, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'cpm', row['date'], comparison);
            },
        },
        {
            name: 'cr',
            placeholder: 'CR из перехода, %',
            render: (args: any) => {
                const {value, footer, row} = args;
                return getStatWithArrowButton(value, footer, 'cr', row['date'], comparison, () =>
                    renderAsPercent(args),
                );
            },
        },
        {
            name: 'crFromView',
            placeholder: 'CR из показа, %',
            render: (args: any) => {
                const {value, footer, row} = args;
                return getStatWithArrowButton(
                    value,
                    footer,
                    'crFromView',
                    row['date'],
                    comparison,
                    () => renderAsPercent(args),
                );
            },
        },
        {
            name: 'openCardCount',
            placeholder: 'Всего переходов, шт.',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(
                    value,
                    footer,
                    'openCardCount',
                    row['date'],
                    comparison,
                );
            },
        },
        {
            name: 'addToCartPercent',
            placeholder: 'CR в корзину, %',
            render: (args: any) => {
                const {value, footer, row} = args;
                return getStatWithArrowButton(
                    value,
                    footer,
                    'addToCartPercent',
                    row['date'],
                    comparison,
                    () => renderAsPercent(args),
                );
            },
        },
        {
            name: 'cartToOrderPercent',
            placeholder: 'CR в заказ, %',
            render: (args: any) => {
                const {value, footer, row} = args;
                return getStatWithArrowButton(
                    value,
                    footer,
                    'cartToOrderPercent',
                    row['date'],
                    comparison,
                    () => renderAsPercent(args),
                );
            },
        },
        {
            name: 'addToCartCount',
            placeholder: 'Корзины, шт.',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(
                    value,
                    footer,
                    'addToCartCount',
                    row['date'],
                    comparison,
                );
            },
        },
        {
            name: 'cpl',
            placeholder: 'CPL, ₽',
            render: ({value, footer, row}: any) => {
                return getStatWithArrowButton(value, footer, 'cpl', row['date'], comparison);
            },
        },
    ];

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
