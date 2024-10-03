import {Button, Card, Icon, Modal, Select, Spin, Text} from '@gravity-ui/uikit';
import {Calculator} from '@gravity-ui/icons';
import React, {useState} from 'react';
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

    const keysOptions = [
        {value: 'campaignName', content: 'Магазин'},
        {value: 'brand', content: 'Бренд'},
        {value: 'object', content: 'Тип предмета'},
        {value: 'title', content: 'Наименование'},
        {value: 'imtId', content: 'ID КТ'},
        {value: 'art', content: 'Артикул'},
        {value: 'tags', content: 'Теги'},
    ];
    const [enteredKeys, setEnteredKeys] = useState(['campaignName']);

    const keysDateTypeOptions = [
        {value: 'day', content: 'День'},
        {value: 'week', content: 'Неделя'},
        {value: 'month', content: 'Месяц'},
        {value: 'period', content: 'Период'},
    ];
    const [enteredKeysDateType, setEnteredKeysDateType] = useState(['day']);

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
                loading={calculatingFlag}
                size="l"
                view="action"
                onClick={() => {
                    setEnteredValuesModalOpen(true);
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
                                <Select
                                    value={enteredKeys}
                                    width={'max'}
                                    size="l"
                                    options={keysOptions}
                                    onUpdate={(nextValue) => {
                                        setEnteredKeys(nextValue);
                                    }}
                                />
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
