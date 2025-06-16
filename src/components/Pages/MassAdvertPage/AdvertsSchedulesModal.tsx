'use client';

import {ActionTooltip, Button, Card, Icon, Modal, Text, Tooltip} from '@gravity-ui/uikit';
import {
    TrashBin,
    CloudArrowUpIn,
    LayoutHeaderCursor,
    ShoppingBasket,
    ShoppingBag,
} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, ReactNode, useState, cloneElement} from 'react';
import {useCampaign} from '@/contexts/CampaignContext';
import callApi, {getUid} from '@/utilities/callApi';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {getLocaleDateString, getRoundValue} from '@/utilities/getRoundValue';
import {useNoCheckedRowsPopup} from '@/shared/ui/NoCheckedRowsPopup';

interface AdvertsSchedulesModalProps {
    setUpdatePaused?: Function;
    paused?: boolean;
    children: ReactNode;
    disabled: boolean;
    doc: any;
    setChangedDoc: (args?: any) => any;
    advertId: number;
    nmIds?: number[];
    getUniqueAdvertIdsFromThePage: (args?: any) => any;
}

export const AdvertsSchedulesModal = ({
    paused,
    children,
    disabled,
    doc,
    setChangedDoc,
    advertId,
    nmIds,
    getUniqueAdvertIdsFromThePage,
}: AdvertsSchedulesModalProps) => {
    const {sellerId} = useCampaign();
    const {showError} = useError();
    const {selectValue} = useCampaign();
    const [open, setOpen] = useState(false);
    const [fetchingHeatMap, setFetchingHeatMap] = useState(0);
    const [heatMap, setHeatMap] = useState<number[][]>([]);

    const getHeatMap = async () => {
        setFetchingHeatMap(1);
        try {
            console.log(advertId, sellerId);
            const res = await ApiClient.post('massAdvert/new/advertSchedule/getHeatMap', {
                advertId,
                seller_id: sellerId,
            });
            if (!res || !res.data || !res.data.heatMap) {
                throw Error('No data in res');
            }
            console.log(res, res.data);
            setHeatMap(res.data.heatMap);
            console.log(heatMap);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingHeatMap(0);
        }
    };

    const getConversionDay = (heatMapTemp: number[][], nms: any[], key: string) => {
        const now = new Date();
        const today = new Date(now); // Clone to avoid mutating original
        const jsDay = today.getDay(); // JS: Sunday = 0, Monday = 1, ..., Saturday = 6

        // Remap: treat Sunday as 7
        const dayOfWeek = jsDay === 0 ? 7 : jsDay;

        // Shift back to the previous full Sunday (00:00)
        const lastFullSunday = new Date(today);
        lastFullSunday.setDate(today.getDate() - dayOfWeek);
        lastFullSunday.setHours(0, 0, 0, 0);

        // Go 4 full weeks back (28 days before that Sunday)
        const fourWeeksAgoSunday = new Date(lastFullSunday);
        fourWeeksAgoSunday.setDate(lastFullSunday.getDate() - 27);

        const coeffs = {} as any;
        for (const row of Object.values(doc?.campaigns?.[selectValue[0] ?? {}]) as any[]) {
            if (!nms.includes(row?.['nmId'])) continue;
            const statistics = row?.['nmFullDetailReport']?.['statistics'];

            for (let i: number = 0; i < 28; i++) {
                const date = new Date(Date.now() - 86400 * 1000 * (i + dayOfWeek));
                const strDate = getLocaleDateString(date);
                let value = 0;
                if (key != 'openCard') value = statistics?.[strDate]?.[key];
                else {
                    const openCardCount = statistics?.[strDate]?.['openCardCount'];
                    const addToCartCount = statistics?.[strDate]?.['addToCartCount'];
                    const cartToOrderPercent = statistics?.[strDate]?.['cartToOrderPercent'];
                    const openToOrderPercent =
                        (cartToOrderPercent * getRoundValue(addToCartCount, openCardCount, true)) /
                        100;
                    value = openToOrderPercent;
                    // console.log(
                    //     openCardCount,
                    //     addToCartCount,
                    //     cartToOrderPercent,
                    //     openToOrderPercent,
                    // );
                }

                if (!value) continue;

                const dayOfWeekDate = date.getDay();
                if (!coeffs[dayOfWeekDate]) coeffs[dayOfWeekDate] = {val: 0, n: 0, avg: 0};
                coeffs[dayOfWeekDate].val += value ?? 0;
                coeffs[dayOfWeekDate].n++;
                coeffs[dayOfWeekDate].avg = coeffs[dayOfWeekDate].val / coeffs[dayOfWeekDate].n;
                if (!coeffs[dayOfWeekDate].avg) coeffs[dayOfWeekDate].avg = 1;
            }
            // console.log(row);
        }
        // console.log(coeffs);

        for (let i = 0; i < 7; i++) {
            console.log(i, heatMapTemp[i]);
            heatMapTemp[i] = heatMapTemp[i].map((value, index) => {
                const toSub =
                    (index >= 7 && index <= 10 ? 0.1 : 0) +
                    (index >= 11 && index <= 15 ? (key != 'openCard' ? 0.05 : 0.002) : 0) +
                    index * 0.001;
                // console.log(
                //     i,
                //     toSub,
                //     (coeffs?.[i]?.avg ?? 100) / 100,
                //     (coeffs?.[i]?.avg ?? 100) / 100 + toSub,
                // );

                return getRoundValue(value, coeffs?.[i]?.avg ?? 100) / 100 + toSub;
            });
            // console.log(i, heatMapTemp[i]);
        }

        setHeatMap(heatMapTemp);

        // console.log(coeffs);
    };

    const getHeatMapLaundries = async () => {
        setFetchingHeatMap(2);
        try {
            console.log(advertId, sellerId);
            const res = await ApiClient.post('massAdvert/new/advertSchedule/getHeatMap', {
                advertId,
                seller_id: sellerId,
            });
            if (!res || !res.data || !res.data.heatMap) {
                throw Error('No data in res');
            }
            console.log(res, res.data);
            const heatMap = res.data.heatMap;
            const advert = doc?.adverts?.[selectValue[0]]?.[advertId];
            let nms = [];
            if (advert?.type == 8) {
                nms = advert?.autoParams?.nms ?? [];
            } else if (advert?.type == 9) {
                nms = advert?.unitedParams?.[0]?.nms ?? [];
            }
            // console.log('nms', advert, nms);
            getConversionDay(heatMap, nms, 'cartToOrderPercent');
            setHeatMap(heatMap);
            // console.log(heatMap);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingHeatMap(0);
        }
    };

    const getHeatMapOpenCards = async () => {
        setFetchingHeatMap(3);
        try {
            console.log(advertId, sellerId);
            const res = await ApiClient.post('massAdvert/new/advertSchedule/getHeatMap', {
                advertId,
                seller_id: sellerId,
            });
            if (!res || !res.data || !res.data.heatMap) {
                throw Error('No data in res');
            }
            console.log(res, res.data);
            const heatMap = res.data.heatMap;
            const advert = doc?.adverts?.[selectValue[0]]?.[advertId];
            let nms = [];
            if (advert?.type == 8) {
                nms = advert?.autoParams?.nms ?? [];
            } else if (advert?.type == 9) {
                nms = advert?.unitedParams?.[0]?.nms ?? [];
            }
            console.log('nms', advert, nms);
            getConversionDay(heatMap, nms, 'openCard');
            setHeatMap(heatMap);
            console.log(heatMap);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingHeatMap(0);
        }
    };

    const getHeatMapByNmIdsLaundries = async () => {
        setFetchingHeatMap(2);
        try {
            console.log(nmIds, sellerId);
            const res = await ApiClient.post('massAdvert/new/advertSchedule/getHeatMapByNmIds', {
                nmIds,
                seller_id: sellerId,
            });
            if (!res || !res.data || !res.data.heatMap) {
                throw Error('No data in res');
            }
            console.log(res, res.data);
            getConversionDay(res.data.heatMap, nmIds ?? [], 'cartToOrderPercent');
            console.log(heatMap);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingHeatMap(0);
        }
    };
    const getHeatMapByNmIdsOpenCard = async () => {
        setFetchingHeatMap(3);
        try {
            console.log(nmIds, sellerId);
            const res = await ApiClient.post('massAdvert/new/advertSchedule/getHeatMapByNmIds', {
                nmIds,
                seller_id: sellerId,
            });
            if (!res || !res.data || !res.data.heatMap) {
                throw Error('No data in res');
            }
            console.log(res, res.data);
            getConversionDay(res.data.heatMap, nmIds ?? [], 'openCard');
            console.log(heatMap);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingHeatMap(0);
        }
    };
    const getHeatMapByNmIds = async () => {
        setFetchingHeatMap(1);
        try {
            console.log(nmIds, sellerId);
            const res = await ApiClient.post('massAdvert/new/advertSchedule/getHeatMapByNmIds', {
                nmIds,
                seller_id: sellerId,
            });
            if (!res || !res.data || !res.data.heatMap) {
                throw Error('No data in res');
            }
            console.log(res, res.data);
            setHeatMap(res.data.heatMap);
            console.log(heatMap);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingHeatMap(0);
        }
    };

    const generateScheduleInput = (args: any) => {
        const interpolateColor = (value: number) => {
            const clamp = (val: number, min: number, max: number) =>
                Math.min(Math.max(val, min), max);

            // Цвета: красный -> жёлтый -> зелёный
            const red = [229, 50, 93];
            const yellow = [255, 190, 92];
            const green = [77, 176, 155];

            if (value < 0.5) {
                // от красного до жёлтого
                const t = clamp(value / 0.5, 0, 1);
                const r = Math.round(red[0] + t * (yellow[0] - red[0]));
                const g = Math.round(red[1] + t * (yellow[1] - red[1]));
                const b = Math.round(red[2] + t * (yellow[2] - red[2]));
                return `rgb(${r}, ${g}, ${b})`;
            } else {
                // от жёлтого до зелёного
                const t = clamp((value - 0.5) / 0.5, 0, 1);
                const r = Math.round(yellow[0] + t * (green[0] - yellow[0]));
                const g = Math.round(yellow[1] + t * (green[1] - yellow[1]));
                const b = Math.round(yellow[2] + t * (green[2] - yellow[2]));
                return `rgb(${r}, ${g}, ${b})`;
            }
        };
        const {scheduleInput, setScheduleInput} = args;
        const weekDayNamesTemp = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const weekInputDayNames = [] as any[];
        const weekInput = [] as any[];

        const tempHours = [] as any[];
        for (let j = 0; j < 24; j++) {
            let sumHourHeatMap = 0;
            for (let i = 0; i < 7; i++) {
                const sumForDay = heatMap?.[i]?.reduce((sum, val) => sum + (val ?? 0), 0);
                sumHourHeatMap += getRoundValue((heatMap?.[i]?.[j] ?? 0) * 100, sumForDay);
            }

            const isCheckboxChecked = (() => {
                for (let i = 0; i < 7; i++) {
                    if (!scheduleInput?.[i]?.[j]?.selected) return false;
                }
                return true;
            })();

            tempHours.push(
                <Tooltip content={`Каждый день ${j}:00 - ${j}:59`}>
                    <motion.div
                        animate={{
                            width: heatMap.length ? 52 : 25,
                            margin: heatMap.length ? 4 : 2,
                            marginBottom: 0,
                        }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text variant="subheader-1">{j}</Text>
                        <Button
                            style={{
                                width: heatMap.length ? 52 : 25,
                                height: heatMap.length ? 18 : 16,
                                margin: heatMap.length ? 4 : 2,
                                marginBottom: 0,
                            }}
                            selected={paused && isCheckboxChecked}
                            view={
                                isCheckboxChecked ? (paused ? 'flat-danger' : 'action') : 'outlined'
                            }
                            onClick={() => {
                                const tempScheduleInput = Object.assign({}, scheduleInput);
                                for (let i = 0; i < 7; i++) {
                                    if (!tempScheduleInput[i]) tempScheduleInput[i] = {};
                                    if (!tempScheduleInput[i][j]) tempScheduleInput[i][j] = {};
                                    tempScheduleInput[i][j] = {selected: !isCheckboxChecked};
                                }

                                // console.log(tempScheduleInput);

                                setScheduleInput(tempScheduleInput);
                            }}
                        >
                            {heatMap.length ? (
                                <Text
                                    variant="subheader-1"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyItems: 'center',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >{`${getRoundValue(sumHourHeatMap * 10, 7) / 10}%`}</Text>
                            ) : undefined}
                        </Button>
                    </motion.div>
                </Tooltip>,
            );
        }
        weekInput.push(
            <div
                style={{display: 'flex', flexDirection: 'row', marginLeft: heatMap.length ? 4 : 2}}
            >
                {tempHours}
            </div>,
        );

        for (let i = 0; i < 7; i++) {
            const isCheckboxChecked =
                scheduleInput[i] &&
                (() => {
                    for (let j = 0; j < 24; j++) {
                        if (!scheduleInput[i][j]) return false;
                        if (!scheduleInput[i][j].selected) return false;
                    }
                    return true;
                })();
            weekInputDayNames.push(
                <Tooltip content={`${weekDayNamesTemp[i]} 00:00 - 23:59`}>
                    <motion.div
                        animate={{
                            height: heatMap.length ? 52 : 25,
                            marginTop: heatMap.length ? 8 : 4,
                        }}
                        style={{
                            // height: 52,
                            // margin: 4,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text variant="subheader-1">{weekDayNamesTemp[i]}</Text>
                        <div style={{minWidth: 4}} />
                        <Button
                            size="s"
                            selected={paused && isCheckboxChecked}
                            style={{
                                width: heatMap.length ? 18 : 16,
                                height: heatMap.length ? 52 : 25,
                                marginRight: heatMap.length ? 4 : 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            view={
                                isCheckboxChecked ? (paused ? 'flat-danger' : 'action') : 'outlined'
                            }
                            onClick={() => {
                                const tempScheduleInput = Object.assign({}, scheduleInput);
                                for (let j = 0; j < 24; j++) {
                                    if (!tempScheduleInput[i]) tempScheduleInput[i] = {};
                                    if (!tempScheduleInput[i][j]) tempScheduleInput[i][j] = {};
                                    tempScheduleInput[i][j] = {selected: !isCheckboxChecked};
                                }
                                console.log(tempScheduleInput);

                                setScheduleInput(tempScheduleInput);
                            }}
                        >
                            {/* {isCheckboxChecked ? <Icon size={1} data={Check} /> : <></>} */}
                        </Button>
                    </motion.div>
                </Tooltip>,
            );
            const temp = [] as any[];
            const flatHeatMap = heatMap.length > i ? heatMap[i] : [];
            const maxHeat = Math.max(...flatHeatMap);
            const minHeat = Math.min(...flatHeatMap);
            let sumForDay = 0;
            if (heatMap.length) {
                for (const a of heatMap[i]) {
                    sumForDay += a;
                }
            }
            const heatRange = maxHeat - minHeat || 1; // чтобы не было деления на 0
            for (let j = 0; j < 24; j++) {
                const isCheckboxChecked = scheduleInput?.[i]?.[j]?.selected;
                temp.push(
                    <Tooltip content={`${weekDayNamesTemp[i]} ${j}:00 - ${j}:59`}>
                        <motion.div
                            animate={{
                                width: heatMap.length ? 52 : 25,
                                height: heatMap.length ? 52 : 25,
                                margin: heatMap.length ? 4 : 2,
                            }}
                        >
                            <Button
                                selected={paused && scheduleInput?.[i]?.[j]?.selected}
                                style={{
                                    width: heatMap.length ? 52 : 25,
                                    height: heatMap.length ? 52 : 25,
                                    margin: heatMap.length ? 4 : 2,
                                    ...(heatMap.length
                                        ? {
                                              backgroundColor: interpolateColor(
                                                  (heatMap[i][j] - minHeat) / heatRange,
                                              ),
                                          }
                                        : {}),
                                    opacity: isCheckboxChecked ? 1 : 0.5,
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                }}
                                view={
                                    heatMap.length
                                        ? undefined
                                        : scheduleInput?.[i]?.[j]?.selected
                                          ? paused
                                              ? 'flat-danger'
                                              : 'action'
                                          : 'outlined'
                                }
                                onClick={() => {
                                    const val = Object.assign({}, scheduleInput);
                                    if (!val[i]) val[i] = {};
                                    if (!val[i][j]) val[i][j] = {selected: false};
                                    val[i][j].selected = !val[i][j].selected;
                                    setScheduleInput(val);
                                }}
                            >
                                {heatMap.length ? (
                                    <div
                                        style={{
                                            height: '100%',
                                            alignSelf: 'center',
                                            justifySelf: 'center',
                                            alignContent: 'center',
                                        }}
                                    >
                                        <Text
                                            // style={{alignSelf: 'center', justifySelf: 'center'}}
                                            color="inverted-primary"
                                            variant="subheader-2"
                                        >
                                            {getRoundValue(heatMap[i][j] * 100, sumForDay)}%
                                        </Text>
                                    </div>
                                ) : undefined}
                            </Button>
                        </motion.div>
                    </Tooltip>,
                );
            }
            weekInput.push(<div style={{display: 'flex', flexDirection: 'row'}}>{temp}</div>);
        }
        return (
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>{weekInputDayNames}</div>
                <div style={{display: 'flex', flexDirection: 'column'}}>{weekInput}</div>
            </div>
        );
    };

    const [scheduleInput, setScheduleInput] = useState({});
    const genTempSchedule = () => {
        const tempScheduleInput: any = {};
        for (let i = 0; i < 7; i++) {
            tempScheduleInput[i] = {};
            for (let j = 0; j < 24; j++) {
                tempScheduleInput[i][j] = {selected: true};
            }
        }
        return tempScheduleInput;
    };

    const handleOpen = () => {
        const schedule = doc.advertsSchedules?.[selectValue[0]]?.[advertId]?.schedule;
        setScheduleInput(advertId ? (schedule ?? genTempSchedule()) : genTempSchedule());
        setOpen(true);
        setHeatMap([]);
    };
    const handleClose = () => setOpen(false);

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AdvertsBidsModal: No valid React element found in children.');
        return null;
    }

    const {NoCheckedRowsPopup, openNoCheckedRowsPopup} = useNoCheckedRowsPopup();

    const triggerFunc = () => {
        if (advertId) {
            handleOpen();
            return;
        }
        const adverts = getUniqueAdvertIdsFromThePage();
        if (Object.keys(adverts).length) handleOpen();
        else openNoCheckedRowsPopup();
    };

    const triggerButton = cloneElement(triggerElement, {
        onClick: triggerFunc,
    });

    return (
        <>
            {!advertId ? NoCheckedRowsPopup : undefined}
            <ActionTooltip title="Показывает график показов РК">{triggerButton}</ActionTooltip>
            <Modal open={open && !disabled} onClose={handleClose}>
                <Card
                    view="clear"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%',
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        style={{
                            overflow: 'hidden',
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backdropFilter: 'blur(48px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                        }}
                    >
                        <Text
                            style={{
                                margin: '8px 0',
                            }}
                            variant="display-2"
                        >
                            График работы
                        </Text>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    margin: '8px 0',
                                }}
                                variant="header-2"
                                color="secondary"
                            >
                                Часовой пояс Москвы — UTC +3 (MSK)
                            </Text>
                        </div>
                        <div style={{minHeight: 8}} />
                        {generateScheduleInput({scheduleInput, setScheduleInput})}
                        <div style={{minHeight: 16}} />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 16,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 16,
                                }}
                            >
                                <Button
                                    size="l"
                                    pin="circle-circle"
                                    selected
                                    view={'outlined-success'}
                                    onClick={() => {
                                        const params: any = {
                                            uid: getUid(),
                                            campaignName: selectValue[0],
                                            data: {
                                                schedule: scheduleInput,
                                                mode: 'Установить',
                                                advertsIds: {},
                                            },
                                        };
                                        if (advertId) {
                                            params.data.advertsIds[advertId] = {
                                                advertId: advertId,
                                            };

                                            doc.advertsSchedules[selectValue[0]][advertId] = {};
                                            doc.advertsSchedules[selectValue[0]][advertId] = {
                                                schedule: scheduleInput,
                                            };
                                        }
                                        const uniqueAdverts = getUniqueAdvertIdsFromThePage();
                                        for (const [id, advertData] of Object.entries(
                                            uniqueAdverts,
                                        )) {
                                            if (!id || !advertData) continue;
                                            const numId = parseInt(id);
                                            if (advertId && numId != advertId) continue;

                                            params.data.advertsIds[numId] = {
                                                advertId: numId,
                                            };

                                            doc.advertsSchedules[selectValue[0]][numId] = {};
                                            doc.advertsSchedules[selectValue[0]][numId] = {
                                                schedule: scheduleInput,
                                            };
                                        }
                                        console.log(params);

                                        callApi('setAdvertsSchedules', params)
                                            .then(() => {
                                                setChangedDoc({...doc});
                                            })
                                            .catch((error) => {
                                                showError(
                                                    error.response?.data?.error ||
                                                        'An unknown error occurred',
                                                );
                                            })
                                            .finally(() => handleClose());
                                    }}
                                >
                                    <Icon data={CloudArrowUpIn} />
                                    Установить
                                </Button>
                                <Button
                                    size="l"
                                    pin="circle-circle"
                                    selected
                                    view={'outlined-danger'}
                                    onClick={() => {
                                        const params: any = {
                                            uid: getUid(),
                                            campaignName: selectValue[0],
                                            data: {
                                                mode: 'Удалить',
                                                advertsIds: {},
                                            },
                                        };
                                        if (advertId) {
                                            params.data.advertsIds[advertId] = {
                                                advertId: advertId,
                                            };

                                            delete doc.advertsSchedules[selectValue[0]][advertId];
                                        }
                                        const uniqueAdverts = getUniqueAdvertIdsFromThePage();
                                        for (const [id, advertData] of Object.entries(
                                            uniqueAdverts,
                                        )) {
                                            if (!id || !advertData) continue;
                                            const numId = parseInt(id);
                                            if (advertId && numId != advertId) continue;

                                            params.data.advertsIds[numId] = {
                                                advertId: numId,
                                            };

                                            delete doc.advertsSchedules[selectValue[0]][numId];
                                        }

                                        console.log(params);

                                        callApi('setAdvertsSchedules', params)
                                            .then(() => {
                                                setChangedDoc({...doc});
                                            })
                                            .catch((error) => {
                                                showError(
                                                    error.response?.data?.error ||
                                                        'An unknown error occurred',
                                                );
                                            })
                                            .finally(() => handleClose());
                                    }}
                                >
                                    <Icon data={TrashBin} />
                                    Удалить
                                </Button>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 16,
                                }}
                            >
                                <ActionTooltip title="Показать тепловую карту заказов за последние 4 недели.">
                                    <Button
                                        size="l"
                                        selected
                                        view="flat-info"
                                        pin="circle-circle"
                                        onClick={() => {
                                            if (nmIds && nmIds.length) {
                                                getHeatMapByNmIds();
                                            } else if (advertId) {
                                                getHeatMap();
                                            }
                                        }}
                                        loading={fetchingHeatMap == 1}
                                    >
                                        <Icon data={ShoppingBag} />
                                        Тепловая карта заказов
                                    </Button>
                                </ActionTooltip>
                                <ActionTooltip title="Показать тепловую карту корзин за последние 4 недели.">
                                    <Button
                                        size="l"
                                        selected
                                        view="flat-info"
                                        pin="circle-circle"
                                        onClick={() => {
                                            if (nmIds && nmIds.length) {
                                                getHeatMapByNmIdsLaundries();
                                            } else if (advertId) {
                                                getHeatMapLaundries();
                                            }
                                        }}
                                        loading={fetchingHeatMap == 2}
                                    >
                                        <Icon data={ShoppingBasket} />
                                        Тепловая карта корзин
                                    </Button>
                                </ActionTooltip>
                                <ActionTooltip title="Показать тепловую карту переходов за последние 4 недели.">
                                    <Button
                                        size="l"
                                        selected
                                        view="flat-info"
                                        pin="circle-circle"
                                        onClick={() => {
                                            if (nmIds && nmIds.length) {
                                                getHeatMapByNmIdsOpenCard();
                                            } else if (advertId) {
                                                getHeatMapOpenCards();
                                            }
                                        }}
                                        loading={fetchingHeatMap == 3}
                                    >
                                        <Icon data={LayoutHeaderCursor} />
                                        Тепловая карта переходов
                                    </Button>
                                </ActionTooltip>
                            </div>
                        </div>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
