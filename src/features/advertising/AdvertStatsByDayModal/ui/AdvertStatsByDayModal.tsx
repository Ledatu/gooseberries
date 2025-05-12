import {ModalWindow} from '@/shared/ui/Modal';
import {getLocaleDateString, renderAsPercent, renderSlashPercent} from '@/utilities/getRoundValue';
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

    const getArrowButton = (
        key: string,
        date: Date,
        comparison: {[key: string]: AdvertDateData},
    ) => {
        if (!key || !date || !comparison) return;
        const dateString = getLocaleDateString(date as Date);
        if (!comparison[dateString]) return;
        if (comparison[dateString][key] > 0) {
            if (lessTheBetterStats.includes(key)) {
                return (
                    <ActionTooltip title={`${Math.abs(comparison[dateString][key])}`}>
                        {/* <Button view="flat-danger"> */}
                        <Text color="danger">
                            <Icon data={CaretUp} />
                        </Text>
                        {/* </Button> */}
                    </ActionTooltip>
                );
            } else if (moreTheBetterStats.includes(key)) {
                return (
                    <ActionTooltip title={`${Math.abs(comparison[dateString][key])}`}>
                        <Text color="positive">
                            <Icon data={CaretUp} />
                        </Text>
                    </ActionTooltip>
                );
            }
        } else if (comparison[dateString][key] < 0) {
            if (lessTheBetterStats.includes(key)) {
                return (
                    <ActionTooltip title={`${Math.abs(comparison[dateString][key])}`}>
                        <Text color="positive">
                            <Icon data={CaretDown} />
                        </Text>
                    </ActionTooltip>
                );
            } else if (moreTheBetterStats.includes(key)) {
                return (
                    <ActionTooltip title={`${Math.abs(comparison[dateString][key])}`}>
                        <Text color="danger">
                            <Icon data={CaretDown} />
                        </Text>
                    </ActionTooltip>
                );
            }
        }
        return undefined;
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
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'orders',
            placeholder: 'Заказы, шт.',
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'sumOrders',
            placeholder: 'Заказы, ₽',
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'avgPrice',
            placeholder: 'Ср. Чек, ₽',
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'drr',
            placeholder: 'ДРР, %',
            render: renderAsPercent,
        },
        {
            name: 'cpo',
            placeholder: 'CPO, ₽',
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'views',
            placeholder: 'Показы, шт.',
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'clicks',
            placeholder: 'Клики, шт.',
            render: (args: any) => renderSlashPercent(args, 'openCardCount'),
        },
        {
            name: 'ctr',
            placeholder: 'CTR, %',
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'cpc',
            placeholder: 'CPC, ₽',
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'cpm',
            placeholder: 'CPM, ₽',
            render: ({value}: any) => {
                return <Text>{value}</Text>;
            },
        },
        {
            name: 'cr',
            placeholder: 'CR, %',
            render: renderAsPercent,
        },
        {
            name: 'openCardCount',
            placeholder: 'Всего переходов, шт.',
            render: ({value, row, footer}: any) => {
                console.log(row, row['date']);
                return (
                    <div style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                        <Text>{value}</Text>
                        {footer
                            ? undefined
                            : getArrowButton('openCardCount', row['date'], comparison)}
                    </div>
                );
            },
        },
        {
            name: 'addToCartPercent',
            placeholder: 'CR в корзину, %',
            render: renderAsPercent,
        },
        {
            name: 'cartToOrderPercent',
            placeholder: 'CR в заказ, %',
            render: renderAsPercent,
        },
        {
            name: 'addToCartCount',
            placeholder: 'Корзины, шт.',
            render: renderAsPercent,
        },
        {
            name: 'cpl',
            placeholder: 'CPL, ₽',
            render: renderAsPercent,
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
