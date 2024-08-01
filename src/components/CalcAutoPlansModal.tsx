import {Button, Card, Icon, List, Modal, Spin, Text, TextInput} from '@gravity-ui/uikit';
import {FileText, CloudArrowUpIn, TrashBin} from '@gravity-ui/icons';
import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';
import callApi, {getUid} from 'src/utilities/callApi';
import {getMonthName} from 'src/utilities/getRoundValue';

export const CalcAutoPlansModal = ({
    columnDataReversed,
    selectValue,
    entityKeysLastCalc,
    colors,
    doc,
    setChangedDoc,
    filteredData,
}) => {
    const [autoPlanModalOpen, setAutoPlanModalOpen] = useState(false);
    const [currenrPlanModalMetrics, setCurrenrPlanModalMetrics] = useState([] as any[]);
    const [planModalPlanValue, setPlanModalPlanValue] = useState('');
    const [planModalPlanValueValid, setPlanModalPlanValueValid] = useState(false);
    const [calculatingAutoPlansFlag, setCalculatingAutoPlansFlag] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
                view="action"
                size="l"
                onClick={async () => {
                    setAutoPlanModalOpen(true);
                    setCurrenrPlanModalMetrics([]);
                    setPlanModalPlanValue('');
                    setPlanModalPlanValueValid(false);
                }}
            >
                <Icon data={FileText} />
                <Text variant="subheader-1">Автопланы</Text>
            </Button>
            <motion.div
                style={{
                    overflow: 'hidden',
                    marginTop: 4,
                }}
                animate={{
                    maxWidth: calculatingAutoPlansFlag ? 40 : 0,
                    opacity: calculatingAutoPlansFlag ? 1 : 0,
                }}
            >
                <Spin style={{marginLeft: 8}} />
            </motion.div>
            <Modal
                open={autoPlanModalOpen}
                onClose={() => {
                    setAutoPlanModalOpen(false);
                    setCurrenrPlanModalMetrics([]);
                }}
            >
                <Card
                    view="outlined"
                    theme="warning"
                    style={{
                        height: '30em',
                        width: 'calc(40em + 200px)',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Card
                        view="outlined"
                        // theme="warning"
                        style={{
                            padding: 20,
                            width: '40em',
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                margin: '0px 32px',
                            }}
                            variant="display-1"
                        >
                            Установить план, % от предыдущего месяца
                        </Text>
                        <div style={{minHeight: 8}} />
                        <TextInput
                            hasClear
                            size="l"
                            value={planModalPlanValue}
                            validationState={planModalPlanValueValid ? undefined : 'invalid'}
                            onUpdate={(val) => {
                                const temp = Number(val != '' ? val : 'ahui');
                                setPlanModalPlanValueValid(!isNaN(temp) && isFinite(temp));
                                setPlanModalPlanValue(val);
                            }}
                            style={{width: 'calc(100% - 32px)'}}
                            placeholder={`Введите план на текущий месяц`}
                        />
                        <div style={{minHeight: 8}} />
                        {generateModalButtonWithActions(
                            {
                                disabled: !planModalPlanValueValid,
                                placeholder: 'Установить план',
                                icon: CloudArrowUpIn,
                                view: 'outlined-success',
                                onClick: () => {
                                    const monthName = getMonthName(new Date());
                                    const percentage = planModalPlanValue;
                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            enteredValues: {
                                                entityKeys: entityKeysLastCalc,
                                                dateType: 'month',
                                            },
                                            plan: {
                                                monthName,
                                                percentage,
                                            },
                                            mode: 'Установить',
                                            entities: [] as any[],
                                            planKeys: currenrPlanModalMetrics,
                                        },
                                    };

                                    for (const row of filteredData) {
                                        const {entity} = row;
                                        if (!params.data.entities.includes(entity))
                                            params.data.entities.push(entity);
                                    }

                                    console.log(params);

                                    //////////////////////////////////
                                    setCalculatingAutoPlansFlag(true);
                                    callApi('setAutoPlanForKeys', params)
                                        .then((res) => {
                                            if (!res || !res['data']) return;
                                            doc['plansData'][selectValue[0]] = res['data'];
                                        })
                                        .finally(() => {
                                            setCalculatingAutoPlansFlag(false);
                                        });
                                    setChangedDoc(doc);
                                    //////////////////////////////////

                                    setAutoPlanModalOpen(false);
                                },
                            },
                            selectedButton,
                            setSelectedButton,
                        )}
                        {generateModalButtonWithActions(
                            {
                                placeholder: 'Удалить план',
                                icon: TrashBin,
                                view: 'outlined-danger',
                                onClick: () => {
                                    const monthName = getMonthName(new Date());
                                    const percentage = planModalPlanValue;
                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {
                                            plan: {
                                                monthName,
                                                percentage,
                                            },
                                            mode: 'Удалить',
                                            entities: [] as any[],
                                            planKeys: currenrPlanModalMetrics,
                                        },
                                    };

                                    for (const row of filteredData) {
                                        const {entity} = row;
                                        if (!params.data.entities.includes(entity))
                                            params.data.entities.push(entity);
                                    }

                                    console.log(params);

                                    //////////////////////////////////
                                    setCalculatingAutoPlansFlag(true);
                                    callApi('setAutoPlanForKeys', params)
                                        .then((res) => {
                                            if (!res || !res['data']) return;

                                            doc['plansData'][selectValue[0]] = res['data'];
                                        })
                                        .finally(() => {
                                            setCalculatingAutoPlansFlag(false);
                                        });
                                    setChangedDoc(doc);
                                    //////////////////////////////////

                                    setAutoPlanModalOpen(false);
                                },
                            },
                            selectedButton,
                            setSelectedButton,
                        )}
                    </Card>
                    <div
                        style={{
                            padding: 8,
                            height: 'calc(100% - 16px)',
                            width: 200,
                            overflow: 'auto',
                            boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <List
                            filterPlaceholder="Введите название метрики"
                            emptyPlaceholder="Такая метрика отсутствует"
                            items={Object.keys(columnDataReversed)}
                            renderItem={(item) => {
                                const selected = currenrPlanModalMetrics.includes(
                                    columnDataReversed[item],
                                );

                                const graphColor = colors[0];
                                const backColor = graphColor
                                    ? graphColor.slice(0, graphColor.length - 10) + '150)'
                                    : undefined;
                                const graphTrendColor = graphColor
                                    ? graphColor.slice(0, graphColor.length - 10) + '650-solid)'
                                    : undefined;

                                return (
                                    <Button
                                        size="xs"
                                        pin="circle-circle"
                                        // selected={selected}
                                        style={{position: 'relative', overflow: 'hidden'}}
                                        view={selected ? 'flat' : 'outlined'}
                                    >
                                        <div
                                            style={{
                                                borderRadius: 10,
                                                left: 0,
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                background: selected ? backColor : '#0000',
                                            }}
                                        />
                                        <Text
                                            style={{
                                                color: selected ? graphTrendColor : undefined,
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </Button>
                                );
                            }}
                            onItemClick={(item) => {
                                const metricVal = columnDataReversed[item];
                                let tempArr = Array.from(currenrPlanModalMetrics);
                                if (tempArr.includes(metricVal)) {
                                    tempArr = tempArr.filter((value) => value != metricVal);
                                } else {
                                    tempArr.push(metricVal);
                                }

                                setCurrenrPlanModalMetrics(tempArr);
                            }}
                        />
                        <Button
                            width="max"
                            view={currenrPlanModalMetrics.length ? 'flat-danger' : 'normal'}
                            selected={currenrPlanModalMetrics.length != 0}
                            onClick={() => {
                                setCurrenrPlanModalMetrics([]);
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon data={TrashBin} />
                                <div style={{minWidth: 3}} />
                                Очистить
                            </div>
                        </Button>
                    </div>
                </Card>
            </Modal>
        </div>
    );
};
