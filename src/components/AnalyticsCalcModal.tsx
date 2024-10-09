import {
    ArrowToggle,
    Button,
    Card,
    Icon,
    Modal,
    Select,
    Spin,
    Switch,
    Text,
} from '@gravity-ui/uikit';
import {Calculator, TrashBin} from '@gravity-ui/icons';
import React, {useMemo, useState} from 'react';
import callApi, {getUid} from 'src/utilities/callApi';
import {getNormalDateRange} from 'src/utilities/getRoundValue';
import {motion} from 'framer-motion';
import {TextTitleWrapper} from './TextTitleWrapper';

export const AnalyticsCalcModal = ({
    setEntityKeysLastCalc,
    setEnteredKeysDateTypeLastCalc,
    setPagesCurrent,
    doc,
    setChangedDoc,
    selectValue,
    dateRange,
}) => {
    const [calculatingFlag, setCalculatingFlag] = useState(false);
    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);

    const [enteredKeys, setEnteredKeys] = useState(['campaignName']);

    const keysDateTypeOptions = [
        {value: 'day', content: 'День'},
        {value: 'week', content: 'Неделя'},
        {value: 'month', content: 'Месяц'},
        {value: 'period', content: 'Период'},
    ];
    const [enteredKeysDateType, setEnteredKeysDateType] = useState(['day']);

    const [enteredKeysCheck, setEnteredKeysCheck] = useState({
        campaignName: true,
        brand: false,
        object: false,
        title: false,
        imtId: false,
        art: false,
        tags: false,
    });

    const [switchesOpen, setSwitchesOpen] = useState(false);

    const switches = useMemo(() => {
        const keysMap = {
            campaignName: 'Магазин',
            brand: 'Бренд',
            object: 'Предмет',
            title: 'Наименование',
            imtId: 'ID КТ',
            art: 'Артикул',
            tags: 'Теги',
        };
        const temp = [] as any[];
        const tempEnteredKeys = [] as string[];
        const buttonString = [] as string[];
        for (const [key, check] of Object.entries(enteredKeysCheck)) {
            temp.push(<div style={{minHeight: 8}} />);
            temp.push(
                <Card>
                    <Switch
                        style={{width: '100%', margin: 8}}
                        onUpdate={(val) => {
                            const newVal = {...enteredKeysCheck};
                            newVal[key] = val;
                            setEnteredKeysCheck(newVal);
                        }}
                        checked={check}
                        content={keysMap[key]}
                    />
                </Card>,
            );
            if (key && check) {
                tempEnteredKeys.push(key);
                buttonString.push(keysMap[key]);
            }
        }

        setEnteredKeys(tempEnteredKeys);
        return (
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    <motion.div
                        style={{width: tempEnteredKeys.length ? 206 : 250}}
                        animate={{
                            width: tempEnteredKeys.length ? 206 : 250,
                        }}
                    >
                        <Button
                            width="max"
                            size="l"
                            view="outlined"
                            onClick={() => {
                                setSwitchesOpen(!switchesOpen);
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Text ellipsis>
                                    {buttonString.length ? buttonString.join(', ') : 'Выберите'}
                                </Text>
                                <Text color="secondary">
                                    <ArrowToggle />
                                </Text>
                            </div>
                        </Button>
                    </motion.div>
                    <motion.div
                        style={{maxWidth: tempEnteredKeys.length ? 37 : 0, overflow: 'hidden'}}
                        animate={{
                            maxWidth: tempEnteredKeys.length ? 37 : 0,
                            marginLeft: tempEnteredKeys.length ? 8 : 0,
                        }}
                    >
                        <Button
                            size="l"
                            view="outlined"
                            onClick={() => {
                                setSwitchesOpen(true);
                                const tempEnteredKeysCheck = {...enteredKeysCheck};
                                for (const key of Object.keys(enteredKeysCheck)) {
                                    tempEnteredKeysCheck[key] = false;
                                }
                                setEnteredKeysCheck(tempEnteredKeysCheck);
                            }}
                        >
                            <Icon data={TrashBin} />
                        </Button>
                    </motion.div>
                </div>
                <motion.div
                    style={{maxHeight: 0, overflow: 'hidden'}}
                    animate={{maxHeight: switchesOpen ? 317 : 0}}
                >
                    {temp}
                </motion.div>
            </div>
        );
    }, [enteredKeysCheck, switchesOpen]);

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
                loading={calculatingFlag}
                size="l"
                view="action"
                onClick={() => {
                    setEnteredValuesModalOpen(true);
                    setSwitchesOpen(false);
                }}
            >
                <Icon data={Calculator} />
                <Text variant="subheader-1">Отчет</Text>
            </Button>
            <motion.div
                style={{
                    overflow: 'hidden',
                    marginTop: 4,
                }}
                animate={{
                    maxWidth: calculatingFlag ? 40 : 0,
                    opacity: calculatingFlag ? 1 : 0,
                }}
            >
                <Spin style={{marginLeft: 8}} />
            </motion.div>
            <Modal
                open={enteredValuesModalOpen}
                onClose={() => {
                    setEnteredValuesModalOpen(false);
                }}
            >
                <Card
                    view="clear"
                    style={{
                        width: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <div
                        style={{
                            height: '50%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '8px 0',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <TextTitleWrapper title={'Отчет по:'} padding={8}>
                                {switches}
                            </TextTitleWrapper>
                        </div>
                        <div style={{minHeight: 8}} />
                        <TextTitleWrapper title={'Группировать по:'} padding={8}>
                            <Select
                                value={enteredKeysDateType}
                                width={'max'}
                                size="l"
                                options={keysDateTypeOptions}
                                onUpdate={(nextValue) => {
                                    setEnteredKeysDateType(nextValue);
                                }}
                            />
                        </TextTitleWrapper>
                        <div style={{minHeight: 12}} />
                        <Button
                            size="l"
                            view="action"
                            disabled={!enteredKeys.length}
                            onClick={() => {
                                setCalculatingFlag(true);
                                const entityKeys = enteredKeys;
                                setEntityKeysLastCalc(entityKeys);
                                setEnteredKeysDateTypeLastCalc(enteredKeysDateType[0]);

                                const params = {
                                    uid: getUid(),
                                    campaignName: selectValue[0],
                                    dateRange: getNormalDateRange(dateRange),
                                    enteredValues: {
                                        entityKeys: entityKeys,
                                        dateType: enteredKeysDateType[0],
                                    },
                                };

                                console.log(params);

                                callApi('getAnalytics', params, true).then((res) => {
                                    if (!res) return;
                                    const resData = res['data'];

                                    doc['analyticsData'][selectValue[0]] =
                                        resData['analyticsData'][selectValue[0]];
                                    doc['plansData'][selectValue[0]] =
                                        resData['plansData'][selectValue[0]];

                                    setChangedDoc({...doc});
                                    setCalculatingFlag(false);
                                    console.log(doc);
                                });

                                setPagesCurrent(1);

                                setEnteredValuesModalOpen(false);
                            }}
                        >
                            <Icon data={Calculator} />
                            <Text variant="subheader-1">Сгенерировать</Text>
                        </Button>
                    </div>
                </Card>
            </Modal>
        </div>
    );
};
