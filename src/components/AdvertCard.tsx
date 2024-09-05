import {Button, Card, Icon, Text} from '@gravity-ui/uikit';
import {
    TrashBin,
    Clock,
    Xmark,
    ArrowDownToSquare,
    Copy,
    Ban,
    Calendar,
    Play,
    Magnifier,
    ChartAreaStacked,
    Rocket,
    Pause,
    LayoutList,
} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useState} from 'react';
import callApi, {getUid} from 'src/utilities/callApi';
import {getLocaleDateString, getRoundValue} from 'src/utilities/getRoundValue';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {AdvertsWordsModal} from './AdvertsWordsModal';
import {AdvertsBidsModal} from './AdvertsBidsModal';
import {AdvertsBudgetsModal} from './AdvertsBudgetsModal';
import {ChartModal} from './ChartModal';

export const AdvertCard = ({
    id,
    index,
    art,
    doc,
    selectValue,
    copiedAdvertsSettings,
    setChangedDoc,
    setShowScheduleModalOpen,
    genTempSchedule,
    manageAdvertsActivityCallFunc,
    setArtsStatsByDayData,
    updateColumnWidth,
    filteredData,
    setCopiedAdvertsSettings,
    setFetchedPlacements,
    currentParsingProgress,
    setCurrentParsingProgress,
    selectedValueMethodOptions,
    columnDataAuction,
    auctionOptions,
    auctionSelectedOption,
    setDateRange,
    setModalOpenFromAdvertId,
    setShowArtStatsModalOpen,
    dateRange,
    bidModalMaxBid,
    setScheduleInput,
    recalc,
    filterByButton,
    selectedValueMethod,
    bidModalRange,
    desiredSumInputValue,
    ordersInputValue,
    bidModalDRRInputValue,
    bidModalStocksThresholdInputValue,
    setBidModalDRRInputValue,
    bidModalMaxBidValid,
    setBidModalDRRInputValidationValue,
    bidModalRangeValid,
    bidModalDRRInputValidationValue,
    setBidModalRange,
    setBidModalMaxBid,
    setBidModalMaxBidValid,
    setSelectedValueMethod,
    setBidModalRangeValid,
    setAuctionSelectedOption,
}) => {
    const [warningBeforeDeleteConfirmation, setWarningBeforeDeleteConfirmation] = useState(false);

    const setCopiedParams = (advertId) => {
        console.log(advertId, 'params will be set from', copiedAdvertsSettings.advertId);
        const params = {
            uid: getUid(),
            campaignName: selectValue[0],
            data: {advertId},
        };
        for (const param of [
            'advertsAutoBidsRules',
            'advertsBudgetsToKeep',
            'advertsPlusPhrasesTemplates',
            'advertsSelectedPhrases',
            'advertsSchedules',
        ]) {
            params.data[param] = doc[param][selectValue[0]][copiedAdvertsSettings.advertId];
            doc[param][selectValue[0]][advertId] = params.data[param];
        }

        console.log(params);
        callApi('copyAdvertsSettings', params)
            .then(() => {
                setChangedDoc({...doc});
            })
            .catch((error) => {
                console.log('error copiyng:', error);
            });
    };

    const advertData = doc.adverts[selectValue[0]][id];
    const drrAI = doc.advertsAutoBidsRules[selectValue[0]][id];
    const budgetToKeep = doc.advertsBudgetsToKeep[selectValue[0]][id];
    if (!advertData) return <></>;
    const {advertId, status, budget, daysInWork, type, budgetLog, pregenerated, cpm} = advertData;
    if (![4, 9, 11].includes(status)) return <></>;

    const curCpm = cpm;

    const curBudget = budget;
    // console.log(advertId, status, words, budget, bid, bidLog, daysInWork, type);

    return (
        <Card
            theme={pregenerated ? 'warning' : 'normal'}
            style={{
                height: 110.5,
                width: 'fit-content',
            }}
            // view="raised"
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
                        <Button
                            selected
                            style={{
                                borderTopLeftRadius: 7,
                                overflow: 'hidden',
                            }}
                            href={`https://cmp.wildberries.ru/campaigns/edit/${advertId}`}
                            target="_blank"
                            size="xs"
                            pin="brick-brick"
                            view={
                                status
                                    ? status == 9
                                        ? 'flat-success'
                                        : status == 11
                                        ? 'flat-danger'
                                        : 'flat-warning'
                                    : 'flat'
                            }
                        >
                            <Icon data={type == 8 ? Rocket : Magnifier} size={11} />
                        </Button>
                        <Button
                            selected
                            onClick={() => filterByButton(advertId, 'adverts')}
                            // style=x{{position: 'relative', top: -2}}
                            size="xs"
                            pin="brick-brick"
                            view={
                                status
                                    ? status == 9
                                        ? 'flat-success'
                                        : status == 11
                                        ? 'flat-danger'
                                        : 'flat-warning'
                                    : 'flat'
                            }
                        >
                            {advertId}
                        </Button>
                        <Button
                            selected
                            style={{
                                borderBottomRightRadius: 9,
                                overflow: 'hidden',
                            }}
                            onClick={async () => {
                                const res = await manageAdvertsActivityCallFunc(
                                    status ? (status == 9 ? 'pause' : 'start') : 'start',
                                    advertId,
                                );
                                console.log(res);
                                if (!res || res['data'] === undefined) {
                                    return;
                                }

                                if (res['data']['status'] == 'ok') {
                                    doc.adverts[selectValue[0]][advertId].status =
                                        status == 9 ? 11 : 9;
                                } else if (res['data']['status'] == 'bad') {
                                    doc.adverts[selectValue[0]][advertId].status =
                                        status == 11 ? 9 : 11;
                                }
                                setChangedDoc({...doc});
                            }}
                            // style={{position: 'relative', top: -2}}
                            disabled={status === undefined}
                            // disabled
                            size="xs"
                            pin="brick-brick"
                            view={
                                status
                                    ? status == 9
                                        ? 'flat-success'
                                        : status == 11
                                        ? 'flat-danger'
                                        : 'flat-warning'
                                    : 'flat'
                            }
                        >
                            <Icon data={status ? (status == 9 ? Pause : Play) : Play} size={11} />
                        </Button>
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
                            selectValue={selectValue}
                            doc={doc}
                            setChangedDoc={setChangedDoc}
                            getUniqueAdvertIdsFromThePage={undefined}
                            advertId={advertId}
                        >
                            <Button
                                pin="brick-round"
                                size="xs"
                                view="flat"
                                onClick={() => {
                                    setModalOpenFromAdvertId(advertId);
                                }}
                            >
                                <Text variant="caption-2">{`CPM: ${curCpm ?? 'Нет инф.'} / ${
                                    drrAI !== undefined
                                        ? `${drrAI.maxBid ?? 'Нет инф.'}`
                                        : 'Автоставки выкл.'
                                }`}</Text>
                                {drrAI !== undefined ? (
                                    <Text style={{marginLeft: 4}} variant="caption-2">
                                        {`${drrAI.autoBidsMode == 'cpo' ? 'CPO' : 'ДРР'}: ${
                                            drrAI.desiredDRR
                                        }`}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                {drrAI !== undefined &&
                                drrAI.autoBidsMode != 'bestPlacement' &&
                                drrAI.autoBidsMode != 'orders' &&
                                drrAI.autoBidsMode != 'drr' &&
                                drrAI.autoBidsMode != 'sum' &&
                                drrAI.autoBidsMode != 'sum_orders' &&
                                drrAI.autoBidsMode != 'obor' &&
                                drrAI.autoBidsMode != 'cpo' ? (
                                    <Text style={{marginLeft: 4}} variant="caption-2">
                                        {`${
                                            drrAI.autoBidsMode == 'auction' ? 'Аукцион:' : 'Выдача:'
                                        } ${drrAI.placementsRange.from}`}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                {drrAI !== undefined && drrAI.autoBidsMode == 'bestPlacement' ? (
                                    <Text style={{marginLeft: 4}} variant="caption-2">
                                        Топ позиция
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                {drrAI !== undefined && drrAI.autoBidsMode == 'orders' ? (
                                    <Text style={{marginLeft: 4}} variant="caption-2">
                                        {`Заказы: ${drrAI.desiredOrders}`}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                {drrAI !== undefined && drrAI.autoBidsMode == 'sum_orders' ? (
                                    <Text style={{marginLeft: 4}} variant="caption-2">
                                        {`Сумм. заказов: ${drrAI.desiredSumOrders}`}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                {drrAI !== undefined && drrAI.autoBidsMode == 'obor' ? (
                                    <Text style={{marginLeft: 4}} variant="caption-2">
                                        {`Обор: ${drrAI.desiredObor} Заказы: ${
                                            !isNaN(drrAI.desiredOrders) && drrAI.desiredOrders
                                                ? drrAI.desiredOrders
                                                : 'Нет. инф.'
                                        }`}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                {drrAI !== undefined && drrAI.autoBidsMode == 'sum' ? (
                                    <Text style={{marginLeft: 4}} variant="caption-2">
                                        {`Расход (${drrAI.desiredSum})`}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                            </Button>
                        </AdvertsBidsModal>

                        <ChartModal
                            fetchingFunction={async () => {
                                const params = {
                                    uid: getUid(),
                                    campaignName: selectValue[0],
                                    advertId: advertId,
                                    startDate: getLocaleDateString(dateRange[0], 10),
                                    endDate: getLocaleDateString(dateRange[1], 10),
                                };
                                console.log(params);

                                try {
                                    const res = await callApi(
                                        'getAdvertBidsLogsForAdvertId',
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
                                    for (let i = 1; i < bidLog.length; i++) {
                                        const {val} = bidLog[i - 1];
                                        const {time, index, cpmIndex, position} = bidLog[i];
                                        if (!time || !val) continue;

                                        // curCpm = val;

                                        const timeObj = new Date(time);
                                        const rbd = new Date(dateRange[1]);
                                        rbd.setHours(23, 59, 59);
                                        if (timeObj < dateRange[0] || timeObj > rbd) continue;
                                        timeline.push(timeObj.getTime());
                                        graphsData.push(val);

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
                            selectValue={selectValue}
                            doc={doc}
                            setChangedDoc={setChangedDoc}
                            getUniqueAdvertIdsFromThePage={undefined}
                            advertId={advertId}
                        >
                            <Button
                                pin="brick-round"
                                size="xs"
                                view="flat"
                                onClick={() => {
                                    setModalOpenFromAdvertId(advertId);
                                }}
                            >
                                <Text variant="caption-2">{`Баланс: ${
                                    curBudget !== undefined ? curBudget : 'Нет инф.'
                                } / ${
                                    budgetToKeep !== undefined ? budgetToKeep : 'Бюджет не задан.'
                                }`}</Text>
                            </Button>
                        </AdvertsBudgetsModal>
                        <ChartModal
                            fetchingFunction={() => {
                                return new Promise((resolve) => {
                                    const timelineBudget: any[] = [];
                                    const graphsDataBudgets: any[] = [];
                                    const graphsDataBudgetsDiv: any[] = [];
                                    const graphsDataBudgetsDivHours = {};
                                    if (budgetLog) {
                                        for (let i = 0; i < budgetLog.length; i++) {
                                            const {budget, time} = budgetLog[i];
                                            if (!time || !budget) continue;

                                            const timeObj = new Date(time);

                                            timeObj.setMinutes(
                                                Math.floor(timeObj.getMinutes() / 15) * 15,
                                            );

                                            const lbd = new Date(dateRange[0]);
                                            lbd.setHours(0, 0, 0, 0);
                                            const rbd = new Date(dateRange[1]);
                                            rbd.setHours(23, 59, 59);
                                            if (timeObj < lbd || timeObj > rbd) continue;
                                            timelineBudget.push(timeObj.getTime());
                                            graphsDataBudgets.push(budget);

                                            const hour = time.slice(0, 13);
                                            if (!graphsDataBudgetsDivHours[hour])
                                                graphsDataBudgetsDivHours[hour] = budget;
                                        }
                                        let prevHour = '';
                                        for (let i = 0; i < timelineBudget.length; i++) {
                                            const dateObj = new Date(timelineBudget[i]);
                                            const time = dateObj.toISOString();
                                            if (dateObj.getMinutes() != 0) {
                                                graphsDataBudgetsDiv.push(null);
                                                continue;
                                            }
                                            const hour = time.slice(0, 13);
                                            if (prevHour == '') {
                                                graphsDataBudgetsDiv.push(null);
                                                prevHour = hour;
                                                continue;
                                            }

                                            const spent =
                                                graphsDataBudgetsDivHours[prevHour] -
                                                graphsDataBudgetsDivHours[hour];
                                            graphsDataBudgetsDiv.push(spent);

                                            prevHour = hour;
                                        }
                                    }

                                    const yagrBudgetData = {
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

                                    resolve(yagrBudgetData);
                                    return yagrBudgetData;
                                });
                            }}
                        >
                            <Button pin="round-brick" size="xs" view="flat">
                                <Icon data={ChartAreaStacked} size={11} />
                            </Button>
                        </ChartModal>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <AdvertsWordsModal
                            doc={doc}
                            selectValue={selectValue}
                            advertId={advertId}
                            art={art}
                            setChangedDoc={setChangedDoc}
                            setFetchedPlacements={setFetchedPlacements}
                            currentParsingProgress={currentParsingProgress}
                            setCurrentParsingProgress={setCurrentParsingProgress}
                            selectedValueMethodOptions={selectedValueMethodOptions}
                            columnDataAuction={columnDataAuction}
                            auctionOptions={auctionOptions}
                            auctionSelectedOption={auctionSelectedOption}
                            bidModalMaxBid={bidModalMaxBid}
                            filterByButton={filterByButton}
                            selectedValueMethod={selectedValueMethod}
                            bidModalRange={bidModalRange}
                            desiredSumInputValue={desiredSumInputValue}
                            ordersInputValue={ordersInputValue}
                            bidModalDRRInputValue={bidModalDRRInputValue}
                            bidModalStocksThresholdInputValue={bidModalStocksThresholdInputValue}
                            setBidModalDRRInputValue={setBidModalDRRInputValue}
                            bidModalMaxBidValid={bidModalMaxBidValid}
                            setBidModalDRRInputValidationValue={setBidModalDRRInputValidationValue}
                            bidModalRangeValid={bidModalRangeValid}
                            bidModalDRRInputValidationValue={bidModalDRRInputValidationValue}
                            setBidModalRange={setBidModalRange}
                            setBidModalMaxBid={setBidModalMaxBid}
                            setBidModalMaxBidValid={setBidModalMaxBidValid}
                            setSelectedValueMethod={setSelectedValueMethod}
                            setBidModalRangeValid={setBidModalRangeValid}
                            setAuctionSelectedOption={setAuctionSelectedOption}
                        />
                    </div>
                    <div
                        style={{
                            minHeight: 0.5,
                            marginTop: 5,
                            width: '100%',
                            background: 'var(--yc-color-base-generic-hover)',
                        }}
                    />
                    <div
                        style={{
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
                            disabled={status === undefined}
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
                                    disabled={advertId == copiedAdvertsSettings.advertId}
                                    view={copiedAdvertsSettings.advertId ? 'normal' : 'flat'}
                                    onClick={() => setCopiedParams(advertId)}
                                >
                                    <Icon data={ArrowDownToSquare} size={11} />
                                </Button>
                                <Button
                                    pin="brick-brick"
                                    view={copiedAdvertsSettings.advertId ? 'normal' : 'flat'}
                                    size="xs"
                                    onClick={() => setCopiedAdvertsSettings({advertId: 0})}
                                >
                                    <Icon data={Xmark} size={11} />
                                </Button>
                            </motion.div>
                        </div>
                        <Button
                            pin="clear-clear"
                            style={{
                                overflow: 'hidden',
                            }}
                            size="xs"
                            // selected
                            // view={index % 2 == 0 ? 'flat' : 'flat-action'}
                            view="flat"
                            onClick={async () => {
                                const params = {
                                    uid: getUid(),
                                    campaignName: selectValue[0],
                                    data: {advertId: advertId},
                                };
                                console.log(params);

                                const res = await callApi('getStatsByDateForAdvertId', params);
                                console.log(res);

                                if (!res) return;

                                const arts = [] as any[];
                                for (let i = 0; i < filteredData.length; i++) {
                                    const {art, adverts} = filteredData[i];
                                    if (!adverts) continue;
                                    for (const [id, _] of Object.entries(adverts)) {
                                        if (id == String(advertId)) {
                                            if (!arts.includes(art)) arts.push(art);
                                        }
                                    }
                                }

                                const {days} = res['data'];

                                const stat = [] as any[];
                                if (days)
                                    for (const [date, dateData] of Object.entries(days)) {
                                        if (!date || !dateData) continue;
                                        dateData['date'] = new Date(date);
                                        dateData['orders'] = Math.round(dateData['orders']);
                                        dateData['sum_orders'] = Math.round(dateData['sum_orders']);
                                        dateData['sum'] = Math.round(dateData['sum']);
                                        dateData['views'] = Math.round(dateData['views']);
                                        dateData['clicks'] = Math.round(dateData['clicks']);

                                        const {orders, sum, clicks, views} = dateData as any;

                                        dateData['drr'] = getRoundValue(
                                            dateData['sum'],
                                            dateData['sum_orders'],
                                            true,
                                            1,
                                        );
                                        dateData['ctr'] = getRoundValue(clicks, views, true);
                                        dateData['cpc'] = getRoundValue(sum, clicks);
                                        dateData['cpm'] = getRoundValue(sum * 1000, views);
                                        dateData['cpo'] = getRoundValue(sum, orders, false, sum);

                                        for (const _art of arts) {
                                            const {advertsStats, nmFullDetailReport} =
                                                doc.campaigns[selectValue[0]][_art];
                                            if (!advertsStats) continue;

                                            if (!nmFullDetailReport) continue;
                                            if (!nmFullDetailReport.statistics) continue;
                                            if (!nmFullDetailReport.statistics[date]) continue;

                                            const {openCardCount, addToCartCount} =
                                                nmFullDetailReport.statistics[date] ?? {
                                                    openCardCount: 0,
                                                    addToCartCount: 0,
                                                };

                                            if (!dateData['openCardCount'])
                                                dateData['openCardCount'] = 0;
                                            if (!dateData['addToCartCount'])
                                                dateData['addToCartCount'] = 0;

                                            dateData['openCardCount'] += openCardCount ?? 0;
                                            dateData['addToCartCount'] += addToCartCount ?? 0;
                                        }
                                        dateData['openCardCount'] = Math.round(
                                            dateData['openCardCount'],
                                        );
                                        dateData['addToCartPercent'] = getRoundValue(
                                            dateData['addToCartCount'],
                                            dateData['openCardCount'],
                                            true,
                                        );
                                        dateData['cartToOrderPercent'] = getRoundValue(
                                            dateData['orders'],
                                            dateData['addToCartCount'],
                                            true,
                                        );
                                        dateData['cr'] = getRoundValue(
                                            dateData['orders'],
                                            dateData['openCardCount'],
                                            true,
                                        );
                                        dateData['cpl'] = getRoundValue(
                                            dateData['sum'],
                                            dateData['addToCartCount'],
                                        );

                                        stat.push(dateData);
                                    }

                                console.log(stat);

                                setArtsStatsByDayData(stat);
                                setShowArtStatsModalOpen(true);
                            }}
                        >
                            <Icon size={11} data={LayoutList}></Icon>
                        </Button>
                        <Button
                            pin="clear-clear"
                            style={{
                                overflow: 'hidden',
                                borderBottomRightRadius: 7,
                            }}
                            size="xs"
                            // selected
                            view={
                                doc.advertsSchedules[selectValue[0]][advertId]
                                    ? 'flat-action'
                                    : 'flat'
                            }
                            onClick={() => {
                                setShowScheduleModalOpen(true);
                                setModalOpenFromAdvertId(advertId);

                                const schedule = doc.advertsSchedules[selectValue[0]][advertId]
                                    ? doc.advertsSchedules[selectValue[0]][advertId].schedule
                                    : undefined;

                                setScheduleInput(schedule ?? genTempSchedule());
                            }}
                        >
                            <Icon size={11} data={Clock} />
                        </Button>
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
                            view={'outlined-danger'}
                            onClick={async () => {
                                setWarningBeforeDeleteConfirmation(false);

                                const res = await manageAdvertsActivityCallFunc('stop', advertId);
                                console.log(res);
                                if (!res || res['data'] === undefined) {
                                    return;
                                }

                                if (res['data']['status'] == 'ok') {
                                    doc.adverts[selectValue[0]][advertId] = undefined;
                                }
                                setChangedDoc({...doc});
                            }}
                        >
                            Удалить
                        </Button>
                        <div style={{minWidth: 8}} />
                        <Button
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
