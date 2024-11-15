import {Button, Card, Icon, Modal, Text} from '@gravity-ui/uikit';
import {TrashBin, CloudArrowUpIn} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import {useCampaign} from 'src/contexts/CampaignContext';
import callApi, {getUid} from 'src/utilities/callApi';
import {useError} from 'src/pages/ErrorContext';

export const AdvertsSchedulesModal = ({
    children,
    disabled,
    doc,
    setChangedDoc,
    advertId,
    getUniqueAdvertIdsFromThePage,
}) => {
    const {showError} = useError();
    const {selectValue} = useCampaign();
    const [open, setOpen] = useState(false);

    const generateScheduleInput = (args) => {
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
                <div
                    style={{
                        width: 25,
                        margin: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text variant="subheader-1">{j}</Text>
                    <Button
                        style={{
                            width: 16,
                            height: 16,
                        }}
                        view={isCheckboxChecked ? 'action' : 'outlined'}
                        onClick={() => {
                            const tempScheduleInput = Object.assign({}, scheduleInput);
                            for (let i = 0; i < 7; i++) {
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
                </div>,
            );
        }
        weekInput.push(<div style={{display: 'flex', flexDirection: 'row'}}>{tempHours}</div>);

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
                <div
                    style={{
                        height: 25,
                        margin: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text variant="subheader-1">{weekDayNamesTemp[i]}</Text>
                    <div style={{minWidth: 4}} />
                    <Button
                        style={{
                            width: 16,
                            height: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        view={isCheckboxChecked ? 'action' : 'outlined'}
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
                </div>,
            );
            const temp = [] as any[];
            for (let j = 0; j < 24; j++) {
                temp.push(
                    <Button
                        style={{width: 25, height: 25, margin: 2}}
                        view={
                            scheduleInput[i]
                                ? scheduleInput[i][j]
                                    ? scheduleInput[i][j].selected
                                        ? 'action'
                                        : 'outlined'
                                    : 'outlined'
                                : 'outlined'
                        }
                        onClick={() => {
                            const val = Object.assign({}, scheduleInput);
                            if (!val[i]) val[i] = {};
                            if (!val[i][j]) val[i][j] = {selected: false};
                            val[i][j].selected = !val[i][j].selected;
                            console.log(val[i][j]);
                            setScheduleInput(val);
                        }}
                    />,
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
        const tempScheduleInput = {};
        for (let i = 0; i < 7; i++) {
            tempScheduleInput[i] = {};
            for (let j = 0; j < 24; j++) {
                tempScheduleInput[i][j] = {selected: true};
            }
        }
        return tempScheduleInput;
    };

    const handleOpen = () => {
        const schedule = doc.advertsSchedules?.[selectValue[0]]?.[advertId]
            ? doc.advertsSchedules[selectValue[0]][advertId].schedule
            : undefined;

        setScheduleInput(advertId ? schedule ?? genTempSchedule() : genTempSchedule());
        setOpen(true);
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

    const triggerButton = React.cloneElement(triggerElement, {
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
                            backdropFilter: 'blur(8px)',
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
                        <div style={{minHeight: 8}} />
                        {generateScheduleInput({scheduleInput, setScheduleInput})}
                        <div style={{minHeight: 16}} />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Button
                                size="l"
                                pin="circle-circle"
                                style={{margin: '8px 0'}}
                                selected
                                view={'outlined-success'}
                                onClick={() => {
                                    const params = {
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
                                style={{margin: '8px 0'}}
                                view={'outlined-danger'}
                                onClick={() => {
                                    const params = {
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
                        </div>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
