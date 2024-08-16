import {Button, Card, Icon, Modal, Spin, Text} from '@gravity-ui/uikit';
import {Calculator} from '@gravity-ui/icons';
import React, {useState} from 'react';
import callApi, {getUid} from 'src/utilities/callApi';
import {getNormalDateRange} from 'src/utilities/getRoundValue';
import {motion} from 'framer-motion';

export const AnalyticsCalcModal = ({
    setEntityKeysLastCalc,
    setPagesCurrent,
    doc,
    setChangedDoc,
    selectValue,
    dateRange,
}) => {
    const [calculatingFlag, setCalculatingFlag] = useState(false);
    const [enteredValuesModalOpen, setEnteredValuesModalOpen] = useState(false);
    const [enteredKeysCheck, setEnteredKeysCheck] = useState({
        campaignName: false,
        brand: false,
        object: false,
        title: false,
        imtId: false,
        art: false,
        tags: false,
    });

    const [enteredKeysDateType, setEnteredKeysDateType] = useState('day');

    const getEnteredKeys = () => {
        const keys = [] as string[];
        for (const [key, check] of Object.entries(enteredKeysCheck)) {
            if (key && check) keys.push(key);
        }
        return keys;
    };

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
                loading={calculatingFlag}
                size="l"
                view="action"
                onClick={() => {
                    setEnteredValuesModalOpen(true);
                    setEnteredKeysCheck({
                        campaignName: false,
                        brand: false,
                        object: false,
                        title: false,
                        imtId: false,
                        art: false,
                        tags: false,
                    });
                }}
            >
                <Icon data={Calculator} />
                <Text variant="subheader-1">Рассчитать</Text>
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
                        width: 350,
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
                            width: 'calc(100% - 32px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '16px 0',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: 'calc(100% + 8px)',
                                }}
                            >
                                {generateSelectButton({
                                    key: 'campaignName',
                                    placeholder: 'Магазин',
                                    enteredKeysCheck,
                                    setEnteredKeysCheck,
                                })}
                                {generateSelectButton({
                                    key: 'brand',
                                    placeholder: 'Бренд',
                                    enteredKeysCheck,
                                    setEnteredKeysCheck,
                                })}
                                {generateSelectButton({
                                    key: 'object',
                                    placeholder: 'Тип предмета',
                                    enteredKeysCheck,
                                    setEnteredKeysCheck,
                                })}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: 'calc(100% + 8px)',
                                }}
                            >
                                {generateSelectButton({
                                    key: 'title',
                                    placeholder: 'Наименование',
                                    enteredKeysCheck,
                                    setEnteredKeysCheck,
                                })}
                                {generateSelectButton({
                                    key: 'imtId',
                                    placeholder: 'ID КТ',
                                    enteredKeysCheck,
                                    setEnteredKeysCheck,
                                })}
                                {generateSelectButton({
                                    key: 'art',
                                    placeholder: 'Артикул',
                                    enteredKeysCheck,
                                    setEnteredKeysCheck,
                                })}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: 'calc(100% + 8px)',
                                }}
                            >
                                {generateSelectButton({
                                    key: 'tags',
                                    placeholder: 'Теги',
                                    enteredKeysCheck,
                                    setEnteredKeysCheck,
                                })}
                            </div>
                        </div>
                        <div style={{minHeight: 4}} />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 'calc(100% - 32px)',
                            }}
                        >
                            <Button
                                pin="round-brick"
                                selected={enteredKeysDateType == 'day'}
                                onClick={() => setEnteredKeysDateType('day')}
                            >
                                <Text variant="subheader-1">По дням</Text>
                            </Button>
                            <Button
                                pin="brick-brick"
                                selected={enteredKeysDateType == 'week'}
                                onClick={() => setEnteredKeysDateType('week')}
                            >
                                <Text variant="subheader-1">По неделям</Text>
                            </Button>
                            <Button
                                pin="brick-round"
                                selected={enteredKeysDateType == 'month'}
                                onClick={() => setEnteredKeysDateType('month')}
                            >
                                <Text variant="subheader-1">По месяцам</Text>
                            </Button>
                        </div>
                        <div style={{minHeight: 12}} />
                        <Button
                            size="l"
                            view="action"
                            onClick={() => {
                                setCalculatingFlag(true);
                                const entityKeys = getEnteredKeys();
                                setEntityKeysLastCalc(entityKeys);
                                const params = {
                                    uid: getUid(),
                                    campaignName: selectValue[0],
                                    dateRange: getNormalDateRange(dateRange),
                                    enteredValues: {
                                        entityKeys: entityKeys,
                                        dateType: enteredKeysDateType,
                                    },
                                };

                                console.log(params);

                                /////////////////////////
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
                                /////////////////////////

                                setEnteredValuesModalOpen(false);
                            }}
                        >
                            <Icon data={Calculator} />
                            <Text variant="subheader-1">Рассчитать</Text>
                        </Button>
                    </div>
                </Card>
            </Modal>
        </div>
    );
};

const generateSelectButton = ({key, enteredKeysCheck, setEnteredKeysCheck, placeholder}) => {
    return (
        <Button
            width="max"
            style={{margin: 4}}
            selected={enteredKeysCheck[key]}
            onClick={() => {
                const temp = {...enteredKeysCheck};
                temp[key] = !temp[key];
                setEnteredKeysCheck(temp);
            }}
        >
            <Text variant="subheader-1">{placeholder}</Text>
        </Button>
    );
};
