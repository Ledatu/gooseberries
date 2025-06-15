'use client';

import {ActionTooltip, Button, Card, Icon, Text} from '@gravity-ui/uikit';
import {
    TrashBin,
    Clock,
    Xmark,
    ArrowDownToSquare,
    Copy,
    Ban,
    Calendar,
    Pause,
    Play,
    ArrowsRotateLeft,
    Magnifier,
    ShoppingCart,
    ChartAreaStacked,
    Rocket,
    BarsAscendingAlignLeftArrowUp,
    ClockArrowRotateLeft,
    CircleInfo,
    ChevronsUpWide,
} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {useEffect, useMemo, useState} from 'react';
import {getLocaleDateString} from '@/utilities/getRoundValue';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {AdvertsBidsModal} from './AdvertsBidsModal';
import {AdvertsBudgetsModal} from './AdvertsBudgetsModal';
import {ChartModal} from './ChartModal';
import {AdvertsWordsButton} from '@/features/advertising/AdvertsWordsModal';
import {AdvertsSchedulesModal} from './AdvertsSchedulesModal';
import ApiClient from '@/utilities/ApiClient';
import {IconWithText} from '@/components/IconWithText';
import {useError} from '@/contexts/ErrorContext';
import {ShortAdvertTemplateInfo} from '@/entities/types/ShortAdvertTemplateInfo';
import {AdvertStatsByDayModalForAdvertId} from '@/features/advertising/AdvertStatsByDayModal/ui/AdvertStatsByDayModalForAdvertId';

interface AdvertCardProps {
    getNames: Function;
    pausedAdverts: any;
    setUpdatePaused: Function;
    permission: string;
    id: string | number;
    index: number;
    sellerId: string;
    advertBudgetRules: any;
    setAdvertBudgetRules: (args?: any) => any;
    nmId: number;
    drrToday: number;
    doc: any;
    selectValue: string[];
    copiedAdvertsSettings: any;
    setChangedDoc: (args?: any) => any;
    manageAdvertsActivityCallFunc: (args?: any, args2?: any) => any;
    // setArtsStatsByDayData: (args?: any) => any;
    updateColumnWidth: (args?: any) => any;
    filteredData: any;
    setCopiedAdvertsSettings: (args?: any) => any;
    setDateRange: (args?: any) => any;
    // setShowArtStatsModalOpen: (args?: any) => any;
    dateRange: any;
    recalc: (args?: any) => any;
    filterByButton: any;
    getUniqueAdvertIdsFromThePage: (args?: any) => any;
    template: ShortAdvertTemplateInfo;
    nmIdBid?: number;
}

const BidRuleInfo = ({rule}: any) => {
    if (!rule) return <></>;
    const {
        placementsRange,
        autoBidsMode,
        desiredOrders,
        desiredSum,
        desiredSumOrders,
        desiredObor,
        sellByDate,
    } = rule;

    const toDisplay = useMemo(() => {
        if (autoBidsMode == 'placements')
            return (
                <IconWithText
                    text={placementsRange?.to}
                    tooltipText={'Место в выдаче'}
                    // variant="caption-2"
                    icon={BarsAscendingAlignLeftArrowUp}
                    size={13}
                />
            );
        if (autoBidsMode == 'auction')
            return (
                <IconWithText
                    text={placementsRange?.to}
                    tooltipText={'Позиция в аукционе'}
                    // variant="caption-2"
                    icon={BarsAscendingAlignLeftArrowUp}
                    size={13}
                />
            );
        if (autoBidsMode == 'bestPlacement')
            return (
                <IconWithText
                    text={'Топ'}
                    tooltipText={'Топ позиция в выдаче'}
                    // variant="caption-2"
                    icon={BarsAscendingAlignLeftArrowUp}
                    size={13}
                />
            );
        if (autoBidsMode == 'obor')
            return (
                <IconWithText
                    text={`${desiredObor} д.`}
                    tooltipText={'Оборачиваемость'}
                    // variant="caption-2"
                    icon={ArrowsRotateLeft}
                    size={13}
                />
            );
        if (autoBidsMode == 'sum_orders')
            return (
                <IconWithText
                    text={`${desiredSumOrders} ₽`}
                    tooltipText={'Сумма заказов'}
                    // variant="caption-2"
                    icon={ShoppingCart}
                    size={13}
                />
            );
        if (autoBidsMode == 'sellByDate')
            return (
                <IconWithText
                    text={new Date(sellByDate ?? '').toLocaleDateString('ru-RU')}
                    tooltipText={'Дата к которой нужно распродать товар'}
                    // variant="caption-2"
                    icon={Calendar}
                    size={13}
                />
            );
        if (autoBidsMode == 'orders')
            return (
                <IconWithText
                    text={`${desiredOrders} шт.`}
                    tooltipText={'Заказы'}
                    // variant="caption-2"
                    icon={ShoppingCart}
                    size={13}
                />
            );
        if (autoBidsMode == 'sum')
            return (
                <IconWithText
                    tooltipText={'Плановый расход'}
                    // variant="caption-2"
                    icon={ClockArrowRotateLeft}
                    size={13}
                    text={`${new Intl.NumberFormat('ru-RU').format(desiredSum)} ₽`}
                />
            );
        else return <></>;
    }, [rule]);

    return toDisplay;
};

export const AdvertCard = ({
    drrToday,
    getNames,
    pausedAdverts,
    setUpdatePaused,
    permission,
    id,
    index,
    sellerId,
    advertBudgetRules,
    setAdvertBudgetRules,
    nmId,
    doc,
    selectValue,
    copiedAdvertsSettings,
    setChangedDoc,
    manageAdvertsActivityCallFunc,
    updateColumnWidth,
    filteredData,
    setCopiedAdvertsSettings,
    setDateRange,
    dateRange,
    recalc,
    filterByButton,
    getUniqueAdvertIdsFromThePage,
    template,
    nmIdBid,
}: AdvertCardProps) => {
    const [arts, setArts] = useState<string[]>([]);
    const advertData = doc.adverts[selectValue[0]][id];
    const drrAI = doc.advertsAutoBidsRules[selectValue[0]][id];
    const {showError} = useError();
    const budgetToKeep = advertBudgetRules?.[id];
    const {
        advertId,
        status,
        budget,
        daysInWork,
        type,
        pregenerated,
        cpm,
        nmCPMs,
        isQueuedToCreate,
    } = advertData;

    useEffect(() => {
        const arts = [] as string[];
        // console.log('filteredData in advertCard', filteredData);
        for (let i = 0; i < filteredData.length; i++) {
            const {art, adverts} = filteredData[i];
            if (!art || !adverts) continue;
            const advertIds = Object.values(adverts)?.map((advert: any) => advert?.['advertId']);
            if (!advertIds.includes(advertId)) continue;
            if (!arts.includes(art)) arts.push(art);
            // console.log('advertId', advertId, art);
        }
        setArts(arts);
    }, [filteredData, advertId]);

    const [warningBeforeDeleteConfirmation, setWarningBeforeDeleteConfirmation] = useState(false);

    const setCopiedParams = async (advertId: number) => {
        console.log(advertId, 'params will be set from', copiedAdvertsSettings.advertId);
        const params: any = {
            seller_id: sellerId,
            advertIdFrom: copiedAdvertsSettings.advertId,
            advertIdTo: advertId,
        };

        console.log(params);
        try {
            const response = await ApiClient.post('massAdvert/new/copy-advert-rules', params);

            if (!response || !response.data) throw new Error('No response');
            for (const [key, value] of Object.entries(response.data)) {
                if (key == 'advertsBudgets') {
                    advertBudgetRules[advertId] = value;
                    setAdvertBudgetRules({...advertBudgetRules});
                } else if (key == 'autoPhrasesTemplate') {
                } else {
                    doc[key][selectValue[0]][advertId] = value;
                }
            }
            getNames();
            setChangedDoc({...doc});
        } catch (error) {
            console.error(new Date(), 'error copy-advert-rules', error);
            showError('Не удалось скопировать настройки РК');
        }
    };

    const curCpm = nmCPMs?.[nmId] ?? cpm;

    const curBudget = budget;

    const infBudget = useMemo(() => {
        if (!budgetToKeep?.maxBudget) return false;
        return String(budgetToKeep?.maxBudget)?.includes('123456789');
    }, [budgetToKeep?.maxBudget]);

    const maxBudget = useMemo(
        () =>
            infBudget
                ? '(∞)'
                : new Intl.NumberFormat('ru-RU').format(Number(budgetToKeep?.maxBudget)) + ' ₽',
        [infBudget, budgetToKeep?.maxBudget],
    );

    const scheduleInfo = doc.advertsSchedules[selectValue[0]][advertId];
    const scheduleStatus = (() => {
        if (!scheduleInfo) return 'none';
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 24; j++) {
                if (scheduleInfo?.schedule?.[i]?.[j]?.selected) return 'working';
            }
        }
        return 'paused';
    })();

    const setPaused = async () => {
        const paused = status == 9;
        const params: any = {
            seller_id: sellerId,
            paused,
            advertId,
        };

        console.log('params', params);

        try {
            await ApiClient.post('massAdvert/set-paused', params);
            setUpdatePaused(true);
        } catch (error: any) {
            showError(error?.response?.data?.error || 'An unknown error occurred');
        }
    };

    const changeStatus = async () => {
        const res = await manageAdvertsActivityCallFunc(
            status ? (status == 9 ? 'pause' : 'start') : 'start',
            advertId,
        );
        console.log(res);
        if (!res || res['data'] === undefined) {
            return;
        }

        if (res['data']['status'] == 'ok') {
            doc.adverts[selectValue[0]][advertId].status = status == 9 ? 11 : 9;
        } else if (res['data']['status'] == 'bad') {
            doc.adverts[selectValue[0]][advertId].status = status == 11 ? 9 : 11;
        }

        setPaused();
    };

    const standardDelete = async () => {
        setWarningBeforeDeleteConfirmation(false);
        if (doc.adverts[selectValue[0]][advertId]) doc.adverts[selectValue[0]][advertId].status = 7;
        try {
            await ApiClient.post('massAdvert/new/queue-advert-to-delete', {
                seller_id: sellerId,
                advertIds: [advertId],
            });
        } catch (error: any) {
            showError(error?.response?.data?.error || 'An unknown error occurred');
        }
        setChangedDoc({...doc});
    };

    const viewForId = isQueuedToCreate
        ? 'flat-warning'
        : status
          ? status == 9
              ? 'flat-success'
              : status == 11
                ? 'flat-danger'
                : 'flat-warning'
          : 'flat';

    if (!advertData || ![4, 9, 11].includes(advertData?.status)) {
        return <></>;
    }

    return (
        <Card
            theme={pregenerated || isQueuedToCreate ? 'warning' : 'normal'}
            style={{
                height: 110.5,
                width: 'fit-content',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <ActionTooltip
                            title={
                                isQueuedToCreate
                                    ? 'Данная РК еще не создана, поэтому перейти в ЛК по клику нельзя.'
                                    : 'Перейти в настройки РК в личном кабинете WB.'
                            }
                        >
                            <Button
                                selected
                                style={{
                                    borderTopLeftRadius: 7,
                                    overflow: 'hidden',
                                }}
                                href={
                                    isQueuedToCreate
                                        ? undefined
                                        : `https://cmp.wildberries.ru/campaigns/edit/${advertId}`
                                }
                                target={isQueuedToCreate ? undefined : '_blank'}
                                size="xs"
                                pin="brick-brick"
                                view={viewForId}
                            >
                                <Icon data={type == 8 ? Rocket : Magnifier} size={11} />
                            </Button>
                        </ActionTooltip>
                        <Button
                            style={{
                                overflow: 'hidden',
                            }}
                            selected
                            onClick={() => filterByButton(advertId, 'adverts')}
                            // style=x{{position: 'relative', top: -2}}
                            size="xs"
                            pin="brick-brick"
                            view={viewForId}
                        >
                            {advertId}
                        </Button>
                        {status ? (
                            <ActionTooltip
                                title={
                                    isQueuedToCreate
                                        ? 'Данная РК находится в очереди на генерацию и будет запущена в ближайшее время. Вы можете установить все необходимые правила на нее, они автоматически перебросятся на реальную РК после ее создания.'
                                        : 'Изменяет статус РК.'
                                }
                            >
                                <Button
                                    selected
                                    style={{
                                        borderBottomRightRadius: 9,
                                        overflow: 'hidden',
                                    }}
                                    onClick={isQueuedToCreate ? undefined : changeStatus}
                                    // style={{position: 'relative', top: -2}}
                                    disabled={status === undefined || permission != 'Управление'}
                                    // disabled
                                    size="xs"
                                    pin="brick-brick"
                                    view={viewForId}
                                >
                                    <Icon
                                        data={
                                            isQueuedToCreate
                                                ? CircleInfo
                                                : status
                                                  ? status == 9
                                                      ? Pause
                                                      : Play
                                                  : Play
                                        }
                                        size={11}
                                    />
                                </Button>
                            </ActionTooltip>
                        ) : (
                            <></>
                        )}
                        <div style={{width: 8}} />
                        <BidRuleInfo rule={drrAI} />
                        <div style={{width: 8}} />
                    </div>
                    <Button
                        pin="clear-clear"
                        style={{
                            borderTopRightRadius: 7,
                            borderBottomLeftRadius: 9,
                            overflow: 'hidden',
                        }}
                        size="xs"
                        // selected
                        view="flat"
                        onClick={() => {
                            const today = new Date();
                            const nDaysAgo = new Date();

                            nDaysAgo.setDate(nDaysAgo.getDate() - daysInWork);

                            const range = [nDaysAgo, today];
                            recalc(range);
                            setDateRange(range);
                        }}
                    >
                        {daysInWork + 1}
                        <div style={{width: 2}} />
                        <Icon size={11} data={status ? Calendar : Ban}></Icon>
                    </Button>
                </div>
                <motion.div
                    animate={{
                        opacity: warningBeforeDeleteConfirmation ? 0 : 1,
                        pointerEvents: warningBeforeDeleteConfirmation ? 'none' : 'auto',
                    }}
                    transition={{
                        duration: 0.2,
                        delay: warningBeforeDeleteConfirmation ? 0 : 0.2,
                    }}
                    style={{
                        height: 76,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <AdvertsBidsModal
                            disabled={permission != 'Управление'}
                            selectValue={selectValue}
                            doc={doc}
                            setChangedDoc={setChangedDoc}
                            getUniqueAdvertIdsFromThePage={undefined}
                            advertId={advertId}
                        >
                            <Button pin="brick-round" size="xs" view="flat">
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        flexWrap: 'nowrap',
                                        columnGap: 4,
                                    }}
                                >
                                    <Text variant="caption-2">{`CPM: ${nmIdBid ?? curCpm ?? 'Нет инф.'} ${
                                        drrAI !== undefined
                                            ? `${drrAI?.useManualMaxCpm ? `/ ${drrAI.maxBid}` : ''}`
                                            : '/ Автоставки выкл.'
                                    }`}</Text>
                                    {drrAI !== undefined &&
                                    (drrAI.useManualMaxCpm
                                        ? ['drr', 'cpo'].includes(drrAI.autoBidsMode)
                                        : true) ? (
                                        <Text variant="caption-2">
                                            {`${drrAI.desiredRent !== undefined ? 'Рент' : drrAI.autoBidsMode == 'cpo' ? 'CPO' : 'ДРР'}: ${
                                                drrAI.desiredRent !== undefined
                                                    ? drrAI.desiredRent
                                                    : drrAI.autoBidsMode == 'cpo'
                                                      ? drrAI?.desiredCpo
                                                      : drrAI.desiredDRR
                                            } ${
                                                !drrAI.drrOption || drrAI.drrOption == 'art'
                                                    ? '(Арт.)'
                                                    : '(РК)'
                                            }`}
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                    {drrAI?.placementsTrigger &&
                                    !['bestPlacement', 'placements', 'auction'].includes(
                                        drrAI.autoBidsMode,
                                    ) ? (
                                        <IconWithText
                                            icon={BarsAscendingAlignLeftArrowUp}
                                            text={drrAI?.placementsTrigger}
                                            variant="caption-2"
                                            size={12}
                                            tooltipText={'Ограничение по выдаче'}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                    {drrAI?.oborStopValue !== undefined ? (
                                        <IconWithText
                                            icon={ArrowsRotateLeft}
                                            text={drrAI?.oborStopValue}
                                            variant="caption-2"
                                            size={12}
                                            tooltipText={'Ограничение по оборачиваемости'}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </Button>
                        </AdvertsBidsModal>

                        <ChartModal
                            fetchingFunction={async () => {
                                const params = {
                                    seller_id: sellerId,
                                    advertId: advertId,
                                    startDate: getLocaleDateString(dateRange[0], 10),
                                    endDate: getLocaleDateString(dateRange[1], 10),
                                };
                                console.log(params);

                                try {
                                    const res = await ApiClient.post(
                                        'massAdvert/get-advert-bids-logs',
                                        params,
                                    );
                                    if (!res) throw 'its undefined';
                                    const advertsBidsLog = res['data'];
                                    console.log(res);

                                    if (advertsBidsLog)
                                        advertsBidsLog.bids = advertsBidsLog.bids.reverse();

                                    const bidLog = advertsBidsLog ? advertsBidsLog.bids : [];

                                    const timeline: any[] = [];
                                    const graphsData: any[] = [];
                                    const graphsDataPosition: any[] = [];
                                    const graphsDataPositionAuction: any[] = [];
                                    const graphsDataPositionOrganic: any[] = [];
                                    const graphsDataOrders: any[] = [];
                                    const graphsDataSum: any[] = [];
                                    const graphsDataDrr: any[] = [];
                                    const graphsDataCr: any[] = [];
                                    for (let i = 1; i < bidLog.length; i++) {
                                        const {val} = bidLog[i - 1];
                                        const {
                                            time,
                                            index,
                                            cpmIndex,
                                            position,
                                            orders,
                                            sum,
                                            drr,
                                            cr,
                                            nmIdBids,
                                        } = bidLog[i];
                                        if (!time || !val) continue;

                                        // curCpm = val;

                                        const timeObj = new Date(time);
                                        const rbd = new Date(dateRange[1]);
                                        rbd.setHours(23, 59, 59);
                                        if (timeObj < dateRange[0] || timeObj > rbd) continue;
                                        timeline.push(timeObj.getTime());
                                        graphsData.push(nmIdBids?.[nmId] ?? val);
                                        graphsDataOrders.push(orders);
                                        graphsDataSum.push(sum);
                                        graphsDataDrr.push(drr);
                                        graphsDataCr.push(cr);

                                        if (index == -1 || !index) graphsDataPosition.push(null);
                                        else graphsDataPosition.push(index);

                                        if (cpmIndex == -1 || !index)
                                            graphsDataPositionAuction.push(null);
                                        else graphsDataPositionAuction.push(cpmIndex);

                                        if (position == -1 || !position)
                                            graphsDataPositionOrganic.push(null);
                                        else graphsDataPositionOrganic.push(position);
                                    }
                                    const yagrData: YagrWidgetData = {
                                        data: {
                                            timeline: timeline,
                                            graphs: [
                                                {
                                                    id: '0',
                                                    name: 'Ставка',
                                                    color: '#5fb8a5',
                                                    data: graphsData,
                                                },
                                                {
                                                    id: '1',
                                                    name: 'Выдача',
                                                    color: '#4aa1f2',
                                                    scale: 'r',
                                                    data: graphsDataPosition,
                                                },
                                                {
                                                    id: '2',
                                                    name: 'Позиция в аукционе',
                                                    color: '#9a63d1',
                                                    scale: 'r',
                                                    data: graphsDataPositionAuction,
                                                },
                                                {
                                                    id: '3',
                                                    name: 'Органическая позиция',
                                                    color: '#708da6',
                                                    scale: 'r2',
                                                    data: graphsDataPositionOrganic,
                                                },
                                                {
                                                    id: '4',
                                                    name: 'Заказы',
                                                    color: '#E91E63',
                                                    scale: 'orders',
                                                    data: graphsDataOrders,
                                                },
                                                {
                                                    id: '5',
                                                    name: 'Расход',
                                                    color: '#FF7043',
                                                    scale: 'sum',
                                                    data: graphsDataSum,
                                                },
                                                {
                                                    id: '6',
                                                    name: 'ДРР',
                                                    color: '#B2FF59',
                                                    scale: 'percents',
                                                    data: graphsDataDrr,
                                                },
                                                {
                                                    id: '7',
                                                    name: 'CR',
                                                    color: '#9FA8DA',
                                                    scale: 'percents',
                                                    data: graphsDataCr,
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
                                                    label: 'Ставка',
                                                    precision: 'auto',
                                                    show: true,
                                                },
                                                r: {
                                                    label: 'Выдача',
                                                    side: 'right',
                                                    precision: 'auto',
                                                    show: true,
                                                },
                                                r1: {
                                                    label: 'Аукцион',
                                                    side: 'right',
                                                    precision: 'auto',
                                                    show: true,
                                                },
                                                r2: {
                                                    label: 'Органика',
                                                    side: 'right',
                                                    precision: 'auto',
                                                    show: true,
                                                },
                                                x: {
                                                    label: 'Время',
                                                    precision: 'auto',
                                                    show: true,
                                                },
                                            },
                                            scales: {},
                                            title: {
                                                text: 'Изменение ставки',
                                            },
                                        },
                                    };
                                    return yagrData;
                                } catch (error) {
                                    console.error('Error fetching adverts bids logs:', error);
                                    return {} as YagrWidgetData;
                                }
                            }}
                            colors={{
                                Ставка: '#5fb8a5',
                                Выдача: '#4aa1f2',
                                'Позиция в аукционе': '#9a63d1',
                                'Органическая позиция': '#708da6',
                                Заказы: '#E91E63',
                                Расход: '#FF7043',
                                ДРР: '#B2FF59',
                            }}
                            extraYAxes={{
                                Ставка: 'y_scale',
                                ДРР: 'drr_scale',
                                Расход: 'sum_scale',
                                Заказы: 'orders_scale',
                                'Позиция в аукционе': 'pos_scale',
                                Выдача: 'pos_scale',
                                'Органическая позиция': 'r2',
                            }}
                        >
                            <Button pin="round-brick" size="xs" view="flat">
                                <Icon data={ChartAreaStacked} size={11} />
                            </Button>
                        </ChartModal>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <AdvertsBudgetsModal
                            disabled={permission != 'Управление'}
                            selectValue={selectValue}
                            sellerId={sellerId}
                            advertBudgetsRules={advertBudgetRules}
                            setAdvertBudgetsRules={setAdvertBudgetRules}
                            getUniqueAdvertIdsFromThePage={undefined}
                            advertId={advertId}
                        >
                            <Button pin="brick-round" size="xs" view="flat">
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        flexWrap: 'nowrap',
                                        columnGap: 4,
                                    }}
                                >
                                    <Text variant="caption-2">
                                        {`Баланс: ${
                                            curBudget !== undefined ? curBudget : 'Нет инф.'
                                        } /${
                                            budgetToKeep !== undefined
                                                ? budgetToKeep?.mode === 'setAutoPurchase'
                                                    ? `${
                                                          budgetToKeep?.desiredDrr
                                                              ? ' ДРР: ' + budgetToKeep?.desiredDrr
                                                              : ''
                                                      } ${maxBudget}`
                                                    : budgetToKeep?.budget
                                                : 'Бюджет не задан.'
                                        }` +
                                            (drrAI
                                                ? drrAI.useAutoBudget
                                                    ? ` (Авто${
                                                          drrAI.maxBudget
                                                              ? `, макс. ${drrAI.maxBudget}`
                                                              : ''
                                                      })`
                                                    : ''
                                                : '')}
                                    </Text>
                                    {drrAI?.rentOptimizerValue !== undefined ? (
                                        <IconWithText
                                            icon={ChevronsUpWide}
                                            text={`${drrAI?.rentOptimizerValue}%`}
                                            variant="caption-2"
                                            size={12}
                                            tooltipText={'Оптимизация цели по рентабельности'}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </Button>
                        </AdvertsBudgetsModal>
                        <ChartModal
                            minMaxValues={{Расход: {min: 0}}}
                            useVerticalLines={true}
                            fetchingFunction={async () => {
                                const params = {
                                    seller_id: sellerId,
                                    advertId: advertId,
                                    startDate: getLocaleDateString(dateRange[0], 10),
                                    endDate: getLocaleDateString(dateRange[1], 10),
                                };
                                console.log(params);

                                let yagrBudgetData = undefined as unknown as YagrWidgetData;

                                try {
                                    const res = await ApiClient.post(
                                        'massAdvert/get-advert-budgets-logs',
                                        params,
                                    );
                                    if (!res) throw 'its undefined';
                                    const budgetLog = res['data'];
                                    console.log(res);

                                    const timelineBudget: any[] = [];
                                    const graphsDataBudgets: any[] = [];
                                    const graphsDataBudgetsDiv: any[] = [];
                                    const graphsDataBudgetsDivHours: any = {};
                                    if (budgetLog) {
                                        const lbd = new Date(dateRange[0]);
                                        lbd.setHours(0, 0, 0, 0);
                                        const rbd = new Date(dateRange[1]);
                                        rbd.setHours(23, 59, 59);
                                        for (let i = 0; i < budgetLog.length; i++) {
                                            const {budget, time} = budgetLog[i];
                                            if (!time || !budget) continue;

                                            const timeObj = new Date(time);

                                            timeObj.setMinutes(
                                                Math.floor(timeObj.getMinutes() / 15) * 15,
                                            );
                                            timeObj.setSeconds(0);
                                            timeObj.setMilliseconds(0);
                                            if (timeObj < lbd || timeObj > rbd) continue;

                                            const hour = timeObj.toISOString().slice(0, 16);
                                            if (graphsDataBudgetsDivHours[hour]) continue;
                                            if (!graphsDataBudgetsDivHours[hour])
                                                graphsDataBudgetsDivHours[hour] = budget;

                                            timelineBudget.push(timeObj.getTime());
                                            graphsDataBudgets.push(budget);
                                        }
                                        let prevHour = '';
                                        let spent = 0;
                                        for (let i = 0; i < timelineBudget.length; i++) {
                                            const dateObj = new Date(timelineBudget[i]);
                                            const time = dateObj.toISOString();
                                            const hour = time.slice(0, 16);
                                            const diff =
                                                graphsDataBudgetsDivHours[prevHour] -
                                                graphsDataBudgetsDivHours[hour];
                                            spent += diff >= 0 ? diff : 0;
                                            // console.log(
                                            //     'spent',
                                            //     spent,
                                            //     prevHour,
                                            //     hour,
                                            //     graphsDataBudgetsDivHours[prevHour],
                                            //     graphsDataBudgetsDivHours[hour],
                                            // );

                                            // if (prevHour == '') {
                                            //     graphsDataBudgetsDiv.push(null);
                                            //     prevHour = hour;
                                            //     continue;
                                            // }
                                            prevHour = hour;
                                            if (dateObj.getMinutes() != 0) {
                                                graphsDataBudgetsDiv.push(null);
                                                continue;
                                            }
                                            graphsDataBudgetsDiv.push(spent);

                                            spent = 0;
                                            // console.log('spent', 0);
                                        }
                                    }

                                    yagrBudgetData = {
                                        data: {
                                            timeline: timelineBudget,
                                            graphs: [
                                                {
                                                    id: '0',
                                                    name: 'Баланс',
                                                    scale: 'y',
                                                    color: '#ffbe5c',
                                                    data: graphsDataBudgets,
                                                },
                                                {
                                                    id: '1',
                                                    type: 'column',
                                                    data: graphsDataBudgetsDiv,
                                                    name: 'Расход',
                                                    scale: 'r',
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
                                                r: {
                                                    label: 'Расход',
                                                    precision: 'auto',
                                                    side: 'right',
                                                    show: true,
                                                },
                                                x: {
                                                    label: 'Время',
                                                    precision: 'auto',
                                                    show: true,
                                                },
                                            },
                                            scales: {y: {min: 0}, r: {min: 0}},
                                            title: {
                                                text: 'Изменение баланса',
                                            },
                                        },
                                    } as YagrWidgetData;
                                } catch (error) {
                                    console.log(error);
                                }
                                return yagrBudgetData;
                            }}
                            colors={{Баланс: '#ffbe5c', Расход: '#7CA8D5FF'}}
                            extraYAxes={{Баланс: 'y_scale', Расход: 'y1_scale_noLine'}}
                        >
                            <Button pin="round-brick" size="xs" view="flat">
                                <Icon data={ChartAreaStacked} size={11} />
                            </Button>
                        </ChartModal>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <AdvertsWordsButton
                            getNames={getNames}
                            disabled={permission != 'Управление'}
                            advertId={advertId}
                            template={template}
                            nmId={nmId}
                        />
                    </div>
                    <div
                        style={{
                            minHeight: 0.5,
                            marginTop: 7,
                            width: '100%',
                            background: 'var(--g-color-base-generic-hover)',
                        }}
                    />
                    <div
                        style={{
                            height: 20,
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Button
                            selected={warningBeforeDeleteConfirmation}
                            style={{
                                display:
                                    index != -1
                                        ? !warningBeforeDeleteConfirmation
                                            ? 'flex'
                                            : 'none'
                                        : 'none',
                                borderBottomLeftRadius: 7,
                                overflow: 'hidden',
                            }}
                            onClick={async () => {
                                setWarningBeforeDeleteConfirmation(
                                    !warningBeforeDeleteConfirmation,
                                );

                                if (!warningBeforeDeleteConfirmation) {
                                    await new Promise((resolve) => {
                                        setTimeout(() => {
                                            setWarningBeforeDeleteConfirmation(false);
                                            resolve(1);
                                        }, 5 * 1000);
                                    });
                                }
                            }}
                            // style={{position: 'relative', top: -2}}
                            disabled={status === undefined || permission != 'Управление'}
                            size="xs"
                            pin="brick-brick"
                            view={warningBeforeDeleteConfirmation ? 'flat-danger' : 'flat'}
                        >
                            <Icon data={TrashBin} size={11} />
                        </Button>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <motion.div
                                animate={{
                                    width: !copiedAdvertsSettings.advertId ? 0 : 70,
                                }}
                                transition={{delay: copiedAdvertsSettings.advertId ? 0.2 : 0}}
                                style={{
                                    width: 0,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflow: 'hidden',
                                }}
                            >
                                <Button
                                    disabled={permission != 'Управление'}
                                    pin="brick-brick"
                                    size="xs"
                                    width="max"
                                    view={copiedAdvertsSettings.advertId ? 'normal' : 'flat'}
                                >
                                    {copiedAdvertsSettings.advertId
                                        ? copiedAdvertsSettings.advertId
                                        : 'Буфер пуст'}
                                </Button>
                            </motion.div>
                            <motion.div
                                onAnimationStart={updateColumnWidth}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflow: 'hidden',
                                }}
                            >
                                <Button
                                    disabled={permission != 'Управление'}
                                    pin="brick-brick"
                                    size="xs"
                                    view={copiedAdvertsSettings.advertId ? 'normal' : 'flat'}
                                    onClick={() => {
                                        setCopiedAdvertsSettings({advertId});
                                    }}
                                >
                                    <Icon data={Copy} size={11} />
                                </Button>
                            </motion.div>
                            <motion.div
                                animate={{
                                    width: !copiedAdvertsSettings.advertId ? 0 : 40,
                                }}
                                transition={{delay: copiedAdvertsSettings.advertId ? 0.2 : 0}}
                                style={{
                                    width: 0,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflow: 'hidden',
                                }}
                            >
                                <Button
                                    pin="brick-brick"
                                    size="xs"
                                    disabled={
                                        advertId == copiedAdvertsSettings.advertId ||
                                        permission != 'Управление'
                                    }
                                    view={copiedAdvertsSettings.advertId ? 'normal' : 'flat'}
                                    onClick={() => setCopiedParams(advertId)}
                                >
                                    <Icon data={ArrowDownToSquare} size={11} />
                                </Button>
                                <Button
                                    disabled={permission != 'Управление'}
                                    pin="brick-brick"
                                    view={copiedAdvertsSettings.advertId ? 'normal' : 'flat'}
                                    size="xs"
                                    onClick={() => setCopiedAdvertsSettings({advertId: 0})}
                                >
                                    <Icon data={Xmark} size={11} />
                                </Button>
                            </motion.div>
                        </div>
                        <div
                            style={{
                                height: 20,
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 4,
                                alignItems: 'center',
                            }}
                        >
                            <Text variant="caption-2">{drrToday ?? 0}%</Text>
                            <AdvertStatsByDayModalForAdvertId
                                arts={arts}
                                advertId={advertId}
                                docCampaign={doc.campaigns[selectValue[0]]}
                                advertType={type == 8 ? 'auto' : 'search'}
                            />
                        </div>
                        <AdvertsSchedulesModal
                            paused={pausedAdverts[advertId]}
                            setUpdatePaused={setUpdatePaused}
                            disabled={permission != 'Управление'}
                            advertId={advertId}
                            doc={doc}
                            setChangedDoc={setChangedDoc}
                            getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                        >
                            <Button
                                pin="clear-clear"
                                style={{
                                    overflow: 'hidden',
                                    borderBottomRightRadius: 7,
                                }}
                                size="xs"
                                disabled={permission != 'Управление'}
                                view={
                                    scheduleStatus == 'working' && !pausedAdverts[advertId]
                                        ? 'flat-action'
                                        : scheduleStatus == 'paused' || pausedAdverts[advertId]
                                          ? 'flat-danger'
                                          : 'flat'
                                }
                                onClick={() => {
                                    if (permission != 'Управление') return;
                                }}
                            >
                                <Icon size={11} data={Clock} />
                            </Button>
                        </AdvertsSchedulesModal>
                    </div>
                </motion.div>
                <motion.div
                    style={{
                        height: 70,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    animate={{
                        opacity: !warningBeforeDeleteConfirmation ? 0 : 1,
                        pointerEvents: !warningBeforeDeleteConfirmation ? 'none' : 'auto',
                        y: !warningBeforeDeleteConfirmation ? 0 : -76 + 4,
                    }}
                    transition={{
                        duration: 0.1,
                        delay: warningBeforeDeleteConfirmation ? 0.05 : 0,
                    }}
                >
                    <Text variant="subheader-1">{'Удалить РК?'}</Text>
                    <div style={{minHeight: 4}} />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <Button
                            disabled={permission != 'Управление'}
                            view={'outlined-danger'}
                            onClick={standardDelete}
                        >
                            Удалить
                        </Button>
                        <div style={{minWidth: 8}} />
                        <Button
                            disabled={permission != 'Управление'}
                            view={'outlined'}
                            onClick={() => {
                                setWarningBeforeDeleteConfirmation(false);
                            }}
                        >
                            Отмена
                        </Button>
                    </div>
                </motion.div>
            </div>
        </Card>
    );
};
