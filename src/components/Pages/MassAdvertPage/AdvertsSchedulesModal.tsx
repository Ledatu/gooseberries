'use client';

import {ActionTooltip, Button, Card, Icon, Modal, Text, Tooltip} from '@gravity-ui/uikit';
import {TrashBin, CloudArrowUpIn, ChartBar} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, ReactNode, useState, cloneElement} from 'react';
import {useCampaign} from '@/contexts/CampaignContext';
import callApi, {getUid} from '@/utilities/callApi';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {getRoundValue} from '@/utilities/getRoundValue';

interface AdvertsSchedulesModalProps {
    setUpdatePaused?: Function;
    paused?: boolean;
    children: ReactNode;
    disabled: boolean;
    doc: any;
    setChangedDoc: (args?: any) => any;
    advertId: number;
    getUniqueAdvertIdsFromThePage: (args?: any) => any;
}

export const AdvertsSchedulesModal = ({
    paused,
    children,
    disabled,
    doc,
    setChangedDoc,
    advertId,
    getUniqueAdvertIdsFromThePage,
}: AdvertsSchedulesModalProps) => {
    const {sellerId} = useCampaign();
    const {showError} = useError();
    const {selectValue} = useCampaign();
    const [open, setOpen] = useState(false);
    const [fetchingHeatMap, setFetchingHeatMap] = useState(false);
    const [heatMap, setHeatMap] = useState<number[][]>([]);

    const getHeatMap = async () => {
        setFetchingHeatMap(true);
        try {
            const res = await ApiClient.post('massAdvert/new/advertSchedule/getHeatMap', {
                advertId,
                seller_id: sellerId,
            });
            if (!res || !res.data || !res.data.heatMap) {
                throw Error('No data in res');
            }
            setHeatMap(res.data.heatMap);
            console.log(heatMap);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingHeatMap(false);
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
            const isCheckboxChecked = (() => {
                for (let i = 0; i < 7; i++) {
                    if (!scheduleInput[i]) return false;
                    if (!scheduleInput[i][j]) return false;
                    if (!scheduleInput[i][j].selected) return false;
                }
                return true;
            })();
            tempHours.push(
                <Tooltip content={`Каждый день ${j}:00 - ${j}:59`}>
                    <motion.div
                        animate={{width: heatMap.length ? 52 : 25, margin: heatMap.length ? 4 : 2}}
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
                            {/* {isCheckboxChecked ? <Icon size={1} data={Check} /> : <></>} */}
                        </Button>
                    </motion.div>
                </Tooltip>,
            );
        }
        weekInput.push(<div style={{display: 'flex', flexDirection: 'row', marginLeft: heatMap.length ? 4 : 2}}>{tempHours}</div>);

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

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
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
                                    const uniqueAdverts = getUniqueAdvertIdsFromThePage();
                                    for (const [id, advertData] of Object.entries(uniqueAdverts)) {
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
                                    const uniqueAdverts = getUniqueAdvertIdsFromThePage();
                                    for (const [id, advertData] of Object.entries(uniqueAdverts)) {
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
                            {advertId ? (
                                <ActionTooltip title="Показать тепловую карту заказов за послежние 4 недели.">
                                    <Button
                                        size="l"
                                        selected
                                        view="flat-info"
                                        pin="circle-circle"
                                        onClick={() => getHeatMap()}
                                        loading={fetchingHeatMap}
                                    >
                                        <Icon data={ChartBar} />
                                        Показать тепловую карту заказов
                                    </Button>
                                </ActionTooltip>
                            ) : (
                                <></>
                            )}
                        </div>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
