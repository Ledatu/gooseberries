import {ButtonsList} from '@/widgets/MassAdvert/buttonsList/ui/list';
import {Button, Card, Icon, List, Modal, Select, Spin, Text} from '@gravity-ui/uikit';
import {AdvertCard} from '@/components/Pages/MassAdvertPage/AdvertCard';
import callApi, {getUid} from '@/utilities/callApi';
import {ArrowsRotateLeft, ChevronDown, Plus, Xmark} from '@gravity-ui/icons';
import DzhemPhrasesModal from '@/components/Pages/MassAdvertPage/DzhemPhrasesModal';
import {motion} from 'framer-motion';
import TheTable, {compare} from '@/components/TheTable';
import {RangePicker} from '@/components/RangePicker';
import block from 'bem-cn-lite';
import {observer} from 'mobx-react-lite';
import {campaignStore} from '@/shared/stores/campaignStore';
import {FC, useState} from 'react';
import ApiClient from '@/utilities/ApiClient';
import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {getRoundValue, renderAsPercent, renderSlashPercent} from '@/utilities/getRoundValue';

const b = block('app');

interface UpTableActionsParams {
    doc: any;
    selectValue: any;
    sellerId: any;
    setChangedDoc: any;
    setChangedDocUpdateType: any;
    dateRange: any;
    filteredData: any;
    permission: any;
    getUniqueAdvertIdsFromThePage: any;
    advertBudgetRules: any;
    setAdvertBudgetRules: any;
    manageAdvertsActivityCallFunc: any;
    recalc: any;
    setDateRange: any;
    anchorRef: any;
    filterByButton: any;
    setCurrentParsingProgress: any;
    setAutoSalesProfits: any;
    setArtsStatsByDayData: any;
    updateColumnWidth: any;
    setFetchedPlacements: any;
    currentParsingProgress: any;
    setUpdatePaused: any;
    pausedAdverts: any;
}

export const UpTableActions: FC<UpTableActionsParams> = observer(
    ({
        doc,
        selectValue,
        sellerId,
        dateRange,
        setChangedDoc,
        setChangedDocUpdateType,
        permission,
        filteredData,
        getUniqueAdvertIdsFromThePage,
        advertBudgetRules,
        setAdvertBudgetRules,
        manageAdvertsActivityCallFunc,
        recalc,
        setDateRange,
        anchorRef,
        filterByButton,
        setCurrentParsingProgress,
        setArtsStatsByDayData,
        setAutoSalesProfits,
        currentParsingProgress,
        setFetchedPlacements,
        updateColumnWidth,
        setUpdatePaused,
        pausedAdverts,
    }) => {
        // if (1 === 1) {
        //     return <div>123123</div>;
        // }
        const {
            selectedNmId,
            fetchingDataFromServerFlag,
            autoSalesModalOpenFromParent,
            showDzhemModalOpen,
            setFetchingDataFromServerFlag,
            artsStatsByDayData,
            setArtsStatsByDayFilteredSummary,
            setAutoSalesModalOpenFromParent,
            rkListMode,
            showArtStatsModalOpen,
            artsStatsByDayFilteredSummary,
            setShowArtStatsModalOpen,
            setAdvertsArtsListModalFromOpen,
            semanticsModalOpenFromArt,
            advertsArtsListModalFromOpen,
            setShowDzhemModalOpen,
            setRkList,
            copiedAdvertsSettings,
            setCopiedAdvertsSettings,
            setSemanticsModalOpenFromArt,
            rkList,
        } = campaignStore;

        const getCampaignName = () => {
            return selectValue[0];
        };

        const columnDataArtByDayStats = [
            {
                name: 'date',
                placeholder: 'Дата',
                render: ({value}: any) => {
                    if (!value) return;
                    if (typeof value === 'number') return `Всего SKU: ${value}`;
                    return <Text>{(value as Date).toLocaleDateString('ru-RU').slice(0, 10)}</Text>;
                },
            },
            {name: 'sum', placeholder: 'Расход, ₽'},
            {name: 'orders', placeholder: 'Заказы, шт.'},
            {name: 'sum_orders', placeholder: 'Заказы, ₽'},
            {
                name: 'avg_price',
                placeholder: 'Ср. Чек, ₽',
            },
            {
                name: 'drr',
                placeholder: 'ДРР, %',
                render: renderAsPercent,
            },
            {
                name: 'cpo',
                placeholder: 'CPO, ₽',
            },
            {name: 'views', placeholder: 'Показы, шт.'},
            {
                name: 'clicks',
                placeholder: 'Клики, шт.',
                render: (args: any) => renderSlashPercent(args, 'openCardCount'),
            },
            {name: 'ctr', placeholder: 'CTR, %', render: renderAsPercent},
            {name: 'cpc', placeholder: 'CPC, ₽'},
            {name: 'cpm', placeholder: 'CPM, ₽'},
            {name: 'cr', placeholder: 'CR, %', render: renderAsPercent},
            {name: 'openCardCount', placeholder: 'Всего переходов, шт.'},
            {name: 'addToCartPercent', placeholder: 'CR в корзину, %', render: renderAsPercent},
            {name: 'cartToOrderPercent', placeholder: 'CR в заказ, %', render: renderAsPercent},
            {name: 'addToCartCount', placeholder: 'Корзины, шт.'},
            {name: 'cpl', placeholder: 'CPL, ₽'},
        ];

        const [artsStatsByDayFilteredData, setArtsStatsByDayFilteredData] = useState<any[]>([]);
        const [artsStatsByDayFilters, setArtsStatsByDayFilters] = useState<any>({undef: false});
        const [artsStatsByDayModeSwitchValue, setArtsStatsByDayModeSwitchValue] = useState<any[]>([
            'Статистика по дням',
        ]);
        const artsStatsByDayModeSwitchValues: any[] = [
            {value: 'Статистика по дням', content: 'Статистика по дням'},
            {
                value: 'Статистика по дням недели',
                content: 'Статистика по дням недели',
                disabled: true,
            },
        ];

        const balance = (() => {
            const map: any = {balance: 'Счет', bonus: 'Бонусы', net: 'Баланс'};

            const temp = doc?.balances?.[selectValue[0]]?.data?.slice(-1)?.[0]?.balance;
            const arr = [] as string[];
            if (temp)
                for (const [type, val] of Object.entries(temp)) {
                    if (val)
                        arr.push(
                            map[type] + ': ' + new Intl.NumberFormat('ru-RU').format(val as number),
                        );
                }
            return arr.join(' ');
        })();

        const updateTheData = async () => {
            console.log('YOOO UPDATE INCOMING');
            setFetchingDataFromServerFlag(true);
            const params = {
                uid: getUid(),
                dateRange: {from: '2023', to: '2024'},
                campaignName: getCampaignName(),
            };
            console.log(params);

            await callApi('getMassAdvertsNew', params, true)
                .then(async (response) => {
                    setFetchingDataFromServerFlag(false);
                    // console.log(response);
                    if (!response) return;
                    const resData = response['data'];

                    const advertsAutoBidsRules = await ApiClient.post(
                        'massAdvert/get-bidder-rules',
                        {
                            seller_id: sellerId,
                        },
                    );
                    const advertsSchedules = await ApiClient.post('massAdvert/get-schedules', {
                        seller_id: sellerId,
                    });
                    const autoSales = await ApiClient.post('massAdvert/get-sales-rules', {
                        seller_id: sellerId,
                    });
                    console.log('advertsAutoBidsRules', advertsAutoBidsRules);

                    resData['advertsAutoBidsRules'][selectValue[0]] = advertsAutoBidsRules?.data;
                    resData['advertsSchedules'][selectValue[0]] = advertsSchedules?.data;
                    resData['autoSales'][selectValue[0]] = autoSales?.data;

                    setChangedDoc(resData);
                    setChangedDocUpdateType(true);
                    // console.log(response ? response['data'] : undefined);
                })
                .catch((error) => console.error(error));
        };

        const getBalanceYagrData = () => {
            const balanceLog =
                doc.balances && doc.balances[selectValue[0]]
                    ? (doc.balances[selectValue[0]]?.data ?? {})
                    : {};

            const timelineBudget: any[] = [];
            const graphsDataBonus: any[] = [];
            const graphsDataBalance: any[] = [];
            const graphsDataNet: any[] = [];
            if (balanceLog) {
                for (let i = 0; i < balanceLog.length; i++) {
                    const time = balanceLog[i].time;
                    const balanceData = balanceLog[i].balance;
                    if (!time || !balanceData) continue;

                    const {net, balance, bonus} = balanceData;

                    const timeObj = new Date(time);

                    timeObj.setMinutes(Math.floor(timeObj.getMinutes() / 15) * 15);

                    const lbd = new Date(dateRange[0]);
                    lbd.setHours(0, 0, 0, 0);
                    const rbd = new Date(dateRange[1]);
                    rbd.setHours(23, 59, 59);
                    if (timeObj < lbd || timeObj > rbd) continue;
                    timelineBudget.push(timeObj.getTime());
                    graphsDataBalance.push(balance ?? 0);
                    graphsDataBonus.push(bonus ?? 0);
                    graphsDataNet.push(net ?? 0);
                }
            }

            const yagrBalanceData: YagrWidgetData = {
                data: {
                    timeline: timelineBudget,
                    graphs: [
                        {
                            id: '0',
                            name: 'Баланс',
                            scale: 'y',
                            color: '#ffbe5c',
                            data: graphsDataNet,
                        },
                        {
                            id: '1',
                            name: 'Бонусы',
                            scale: 'y',
                            color: '#4aa1f2',
                            data: graphsDataBonus,
                        },
                        {
                            id: '2',
                            name: 'Счет',
                            scale: 'y',
                            color: '#5fb8a5',
                            data: graphsDataBalance,
                        },
                    ],
                },

                libraryConfig: {
                    chart: {
                        series: {
                            spanGaps: false,
                            type: 'line',
                            interpolation: 'smooth',
                        },
                    },
                    axes: {
                        y: {
                            label: 'Баланс',
                            precision: 'auto',
                            show: true,
                        },
                        x: {
                            label: 'Время',
                            precision: 'auto',
                            show: true,
                        },
                    },
                    series: [],
                    scales: {y: {min: 0}},
                    title: {
                        text: 'Изменение баланса',
                    },
                },
            };

            return yagrBalanceData;
        };

        const artsStatsByDayDataFilter = (withfFilters: any, stats: any[]) => {
            const _filters = withfFilters ?? artsStatsByDayFilters;
            const _stats = stats ?? artsStatsByDayData;

            const artsStatsByDayFilteredSummaryTemp: any = {
                date: 0,
                orders: 0,
                sum_orders: 0,
                avg_price: 0,
                sum: 0,
                views: 0,
                clicks: 0,
                drr: 0,
                ctr: 0,
                cpc: 0,
                cpm: 0,
                cr: 0,
                cpo: 0,
                openCardCount: 0,
                addToCartCount: 0,
                addToCartPercent: 0,
                cartToOrderPercent: 0,
                cpl: 0,
            };

            _stats.sort((a, b) => {
                const dateA = new Date(a['date']);
                const dateB = new Date(b['date']);
                return dateB.getTime() - dateA.getTime();
            });

            setArtsStatsByDayFilteredData(
                _stats
                    .map((stat) => {
                        const {sum_orders: SO, orders: O} = stat ?? {};
                        const avgPrice = getRoundValue(SO, O);
                        return {...stat, avg_price: avgPrice};
                    })
                    .filter((stat) => {
                        for (const [filterArg, data] of Object.entries(_filters)) {
                            const filterData: any = data;
                            if (filterArg == 'undef' || !filterData) continue;
                            if (filterData['val'] == '') continue;
                            else if (!compare(stat[filterArg], filterData)) {
                                return false;
                            }
                        }

                        for (const [key, val] of Object.entries(stat)) {
                            if (
                                [
                                    'sum',
                                    'clicks',
                                    'views',
                                    'orders',
                                    'sum_orders',
                                    'avg_prices',
                                    'openCardCount',
                                    'addToCartCount',
                                    'addToCartPercent',
                                    'cartToOrderPercent',
                                ].includes(key)
                            )
                                artsStatsByDayFilteredSummaryTemp[key] +=
                                    isFinite(val as number) && !isNaN(val as number) ? val : 0;
                        }

                        artsStatsByDayFilteredSummaryTemp['date']++;

                        return true;
                    }),
            );

            artsStatsByDayFilteredSummaryTemp.sum_orders = Math.round(
                artsStatsByDayFilteredSummaryTemp.sum_orders,
            );
            artsStatsByDayFilteredSummaryTemp.orders = Math.round(
                artsStatsByDayFilteredSummaryTemp.orders,
            );
            artsStatsByDayFilteredSummaryTemp.avg_price = getRoundValue(
                artsStatsByDayFilteredSummaryTemp.sum_orders,
                artsStatsByDayFilteredSummaryTemp.orders,
            );
            artsStatsByDayFilteredSummaryTemp.sum = Math.round(
                artsStatsByDayFilteredSummaryTemp.sum,
            );
            artsStatsByDayFilteredSummaryTemp.views = Math.round(
                artsStatsByDayFilteredSummaryTemp.views,
            );
            artsStatsByDayFilteredSummaryTemp.clicks = Math.round(
                artsStatsByDayFilteredSummaryTemp.clicks,
            );
            artsStatsByDayFilteredSummaryTemp.openCardCount = Math.round(
                artsStatsByDayFilteredSummaryTemp.openCardCount,
            );
            artsStatsByDayFilteredSummaryTemp.addToCartPercent = getRoundValue(
                artsStatsByDayFilteredSummaryTemp.addToCartCount,
                artsStatsByDayFilteredSummaryTemp.openCardCount,
                true,
            );
            artsStatsByDayFilteredSummaryTemp.cartToOrderPercent = getRoundValue(
                artsStatsByDayFilteredSummaryTemp.orders,
                artsStatsByDayFilteredSummaryTemp.addToCartCount,
                true,
            );
            const {orders, sum, views, clicks, openCardCount, addToCartCount} =
                artsStatsByDayFilteredSummaryTemp;

            artsStatsByDayFilteredSummaryTemp.drr = getRoundValue(
                artsStatsByDayFilteredSummaryTemp.sum,
                artsStatsByDayFilteredSummaryTemp.sum_orders,
                true,
                1,
            );
            artsStatsByDayFilteredSummaryTemp.ctr = getRoundValue(clicks, views, true);
            artsStatsByDayFilteredSummaryTemp.cpc = getRoundValue(
                sum / 100,
                clicks,
                true,
                sum / 100,
            );
            artsStatsByDayFilteredSummaryTemp.cpm = getRoundValue(sum * 1000, views);
            artsStatsByDayFilteredSummaryTemp.cr = getRoundValue(orders, openCardCount, true);
            artsStatsByDayFilteredSummaryTemp.cpo = getRoundValue(sum, orders, false, sum);
            artsStatsByDayFilteredSummaryTemp.cpl = getRoundValue(sum, addToCartCount, false, sum);

            setArtsStatsByDayFilteredSummary(artsStatsByDayFilteredSummaryTemp);
        };

        return (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <ButtonsList
                        balance={balance}
                        doc={doc}
                        filteredData={filteredData}
                        permission={permission}
                        getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                        selectValue={selectValue}
                        sellerId={sellerId}
                        advertBudgetRules={advertBudgetRules}
                        setAdvertBudgetRules={setAdvertBudgetRules}
                        setAutoSalesModalOpenFromParent={setAutoSalesModalOpenFromParent}
                        getBalanceYagrData={getBalanceYagrData}
                        filterByButton={filterByButton}
                        setAutoSalesProfits={setAutoSalesProfits}
                        autoSalesModalOpenFromParent={autoSalesModalOpenFromParent}
                        setChangedDoc={setChangedDoc}
                        setUpdatePaused={setUpdatePaused}
                    />
                    <Modal
                        open={advertsArtsListModalFromOpen}
                        onClose={() => {
                            setAdvertsArtsListModalFromOpen(false);
                            setSemanticsModalOpenFromArt('');
                        }}
                    >
                        <div
                            style={{
                                margin: 20,
                                width: '30vw',
                                height: '60vh',
                                overflow: 'scroll',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    margin: '8px 0',
                                }}
                                variant="display-2"
                            >
                                {rkListMode == 'add'
                                    ? 'Добавить артикул в РК'
                                    : 'Удалить артикул из РК'}
                            </Text>
                            <List
                                filterPlaceholder={`Поиск по Id кампании среди ${rkList.length} шт.`}
                                items={rkList}
                                itemHeight={112}
                                renderItem={(advertId) => {
                                    return (
                                        <div
                                            style={{
                                                padding: '0 16px',
                                                display: 'flex',
                                                margin: '4px 0',
                                                flexDirection: 'row',
                                                height: 96,
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                            }}
                                        >
                                            <AdvertCard
                                                sellerId={sellerId}
                                                advertBudgetRules={advertBudgetRules}
                                                setAdvertBudgetRules={setAdvertBudgetRules}
                                                permission={permission}
                                                id={advertId}
                                                index={-1}
                                                art={''}
                                                doc={doc}
                                                selectValue={selectValue}
                                                copiedAdvertsSettings={copiedAdvertsSettings}
                                                setChangedDoc={setChangedDoc}
                                                manageAdvertsActivityCallFunc={
                                                    manageAdvertsActivityCallFunc
                                                }
                                                setArtsStatsByDayData={setArtsStatsByDayData}
                                                updateColumnWidth={updateColumnWidth}
                                                filteredData={filteredData}
                                                setCopiedAdvertsSettings={setCopiedAdvertsSettings}
                                                setFetchedPlacements={setFetchedPlacements}
                                                currentParsingProgress={currentParsingProgress}
                                                setCurrentParsingProgress={
                                                    setCurrentParsingProgress
                                                }
                                                setDateRange={setDateRange}
                                                setShowArtStatsModalOpen={setShowArtStatsModalOpen}
                                                dateRange={dateRange}
                                                recalc={recalc}
                                                filterByButton={filterByButton}
                                                getUniqueAdvertIdsFromThePage={
                                                    getUniqueAdvertIdsFromThePage
                                                }
                                                pausedAdverts={pausedAdverts}
                                                setUpdatePaused={setUpdatePaused}
                                            />
                                            <div style={{minWidth: 8}} />
                                            <Button
                                                view={
                                                    rkListMode == 'add'
                                                        ? 'outlined-success'
                                                        : 'outlined-danger'
                                                }
                                                disabled={
                                                    !doc.adverts?.[selectValue[0]]?.[advertId] ||
                                                    doc?.adverts?.[selectValue[0]]?.[advertId]
                                                        ?.type != 8
                                                }
                                                onClick={async () => {
                                                    const params: any = {
                                                        uid: getUid(),
                                                        campaignName: selectValue[0],
                                                        data: {
                                                            advertsIds: {},
                                                            mode: rkListMode,
                                                        },
                                                    };
                                                    params.data.advertsIds[advertId] = {
                                                        advertId: advertId,
                                                        art: semanticsModalOpenFromArt,
                                                    };

                                                    console.log(params);

                                                    const res = await callApi(
                                                        'manageAdvertsNMs',
                                                        params,
                                                    );
                                                    console.log(res);
                                                    if (!res || res['data'] === undefined) {
                                                        return;
                                                    }

                                                    if (res['data']['status'] == 'ok') {
                                                        if (
                                                            !doc.campaigns[selectValue[0]][
                                                                semanticsModalOpenFromArt
                                                            ].adverts
                                                        )
                                                            doc.campaigns[selectValue[0]][
                                                                semanticsModalOpenFromArt
                                                            ].adverts = {};

                                                        doc.campaigns[selectValue[0]][
                                                            semanticsModalOpenFromArt
                                                        ].adverts[advertId] =
                                                            rkListMode == 'add'
                                                                ? {advertId: advertId}
                                                                : undefined;

                                                        if (rkListMode == 'delete') {
                                                            delete doc.campaigns[selectValue[0]][
                                                                semanticsModalOpenFromArt
                                                            ].adverts[advertId];
                                                            const adverts =
                                                                doc.campaigns[selectValue[0]][
                                                                    semanticsModalOpenFromArt
                                                                ].adverts;
                                                            if (adverts) {
                                                                const temp = [] as any[];
                                                                for (const [
                                                                    _,
                                                                    data,
                                                                ] of Object.entries(adverts)) {
                                                                    const advertData: any = data;
                                                                    if (!advertData) continue;
                                                                    temp.push(
                                                                        advertData['advertId'],
                                                                    );
                                                                }
                                                                setRkList(temp);
                                                            }
                                                        }

                                                        setAdvertsArtsListModalFromOpen(false);
                                                    }
                                                    setChangedDoc({...doc});
                                                }}
                                            >
                                                <Icon data={rkListMode == 'add' ? Plus : Xmark} />
                                            </Button>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </Modal>
                    {showDzhemModalOpen && (
                        <DzhemPhrasesModal
                            open={showDzhemModalOpen}
                            onClose={() => setShowDzhemModalOpen(false)}
                            sellerId={sellerId}
                            nmId={selectedNmId}
                        />
                    )}
                    <Modal
                        open={showArtStatsModalOpen}
                        onClose={() => setShowArtStatsModalOpen(false)}
                    >
                        <motion.div
                            onAnimationStart={async () => {
                                await new Promise((resolve) => setTimeout(resolve, 300));
                                artsStatsByDayDataFilter(
                                    {sum: {val: '', mode: 'include'}},
                                    artsStatsByDayData,
                                );
                            }}
                            animate={{maxHeight: showArtStatsModalOpen ? '60em' : 0}}
                            style={{
                                margin: 20,
                                maxWidth: '90vw',
                                // maxHeight: '60em',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    margin: '8px 0',
                                    alignItems: 'center',
                                }}
                            >
                                {/* <Text variant="display-2">Статистика по</Text> */}
                                <Select
                                    className={b('selectCampaign')}
                                    value={artsStatsByDayModeSwitchValue}
                                    placeholder="Values"
                                    options={artsStatsByDayModeSwitchValues}
                                    renderControl={({triggerProps: {onClick, onKeyDown}}) => {
                                        return (
                                            <Button
                                                style={{
                                                    marginTop: 12,
                                                }}
                                                // ref={ref as Ref<HTMLButtonElement>}
                                                size="xl"
                                                view="outlined"
                                                onClick={onClick}
                                                onKeyDown={onKeyDown}
                                                // extraProps={{
                                                //     onKeyDown,
                                                // }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Text
                                                        variant="display-2"
                                                        style={{marginBottom: 8}}
                                                    >
                                                        {artsStatsByDayModeSwitchValue[0]}
                                                    </Text>
                                                    <div style={{width: 4}} />
                                                    <Icon size={26} data={ChevronDown} />
                                                </div>
                                            </Button>
                                        );
                                    }}
                                    onUpdate={(nextValue) => {
                                        setArtsStatsByDayModeSwitchValue(nextValue);
                                    }}
                                />
                            </div>
                            <div style={{minHeight: 8}} />
                            <Card
                                style={{
                                    overflow: 'auto',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <TheTable
                                    columnData={columnDataArtByDayStats}
                                    data={artsStatsByDayFilteredData}
                                    filters={artsStatsByDayFilters}
                                    setFilters={setArtsStatsByDayFilters}
                                    filterData={artsStatsByDayDataFilter}
                                    footerData={[artsStatsByDayFilteredSummary]}
                                    tableId={''}
                                    usePagination={false}
                                />
                            </Card>
                        </motion.div>
                    </Modal>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button
                            style={{
                                marginBottom: 8,
                            }}
                            loading={fetchingDataFromServerFlag}
                            size="l"
                            view="action"
                            onClick={updateTheData}
                        >
                            <Icon data={ArrowsRotateLeft} />
                        </Button>
                        <div style={{width: 8}} />
                        {fetchingDataFromServerFlag ? <Spin style={{marginRight: 8}} /> : <></>}
                    </div>
                    <RangePicker
                        args={{
                            recalc,
                            dateRange,
                            setDateRange,
                            anchorRef,
                        }}
                    />
                </div>
            </div>
        );
    },
);
