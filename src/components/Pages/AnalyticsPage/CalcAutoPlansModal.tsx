'use client';

import {Button, Card, Icon, List, Modal, Spin, Text, TextInput} from '@gravity-ui/uikit';
import {FileText, CloudArrowUpIn, TrashBin} from '@gravity-ui/icons';
import {useState} from 'react';
import {motion} from 'framer-motion';
// import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';
import callApi, {getUid} from '@/utilities/callApi';
import {getMonth} from '@/utilities/getRoundValue';
import {cx} from '@/lib/utils';

interface CalcAutoPlansModalProps {
    disabled: boolean;
    selectValue: string[];
    entityKeysLastCalc: any;
    colors: {[key: string]: string};
    doc: any;
    setChangedDoc: ({}: any) => any;
    columnDataReversed: any;
    filteredData: any;
}

export const CalcAutoPlansModal = ({
    disabled,
    selectValue,
    entityKeysLastCalc,
    colors,
    doc,
    setChangedDoc,
    columnDataReversed,
    filteredData,
}: CalcAutoPlansModalProps) => {
    const [autoPlanModalOpen, setAutoPlanModalOpen] = useState(false);
    const [planModalPlanValue, setPlanModalPlanValue] = useState('');
    const [planModalPlanValueValid, setPlanModalPlanValueValid] = useState(false);
    const [calculatingAutoPlansFlag, setCalculatingAutoPlansFlag] = useState(false);
    const [currenrPlanModalMetrics, setCurrenrPlanModalMetrics] = useState([] as any[]);

    const handleSetPlanButton = () => {
        const monthName = getMonth(new Date());
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
            if (!params.data.entities.includes(entity)) params.data.entities.push(entity);
        }

        console.log(params);

        setCalculatingAutoPlansFlag(true);
        callApi('setAutoPlanForKeys', params)
            .then((res) => {
                if (!res || !res['data']) return;
                doc['plansData'][selectValue[0]] = res['data'];
            })
            .finally(() => {
                setCalculatingAutoPlansFlag(false);
            });
        setChangedDoc({...doc});

        setAutoPlanModalOpen(false);
    };

    const handleDeletePlanButton = () => {
        const monthName = getMonth(new Date());
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
            if (!params.data.entities.includes(entity)) params.data.entities.push(entity);
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
        setChangedDoc({...doc});
        //////////////////////////////////

        setAutoPlanModalOpen(false);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
                disabled={disabled}
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
                    className={cx(['blurred-card', 'centred-absolute-element'])}
                    view="outlined"
                    theme="warning"
                    style={{
                        left: 0,
                        right: 0,
                        marginInline: 'auto',
                        // width: 'fit-content',
                        marginBlock: 'auto',
                        // marginTop: 'auto',
                        // marginBottom: 'auto',
                        // marginBlock: 'auto',
                        position: 'absolute',
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
                            Установить план с приростом или снизить план, относительно результатов
                            предыдущего месяца, устанавливается в % (для снижения укажите - минус,
                            пример -10%)
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
                        <Button
                            style={{marginBottom: '8px'}}
                            size="l"
                            pin="circle-circle"
                            disabled={!planModalPlanValueValid}
                            view="outlined-success"
                            onClick={handleSetPlanButton}
                        >
                            <Icon data={CloudArrowUpIn} />
                            Установить план
                        </Button>
                        <Button
                            style={{marginBottom: '8px'}}
                            size="l"
                            pin="circle-circle"
                            disabled={!planModalPlanValueValid}
                            view="outlined-danger"
                            onClick={handleDeletePlanButton}
                        >
                            <Icon data={TrashBin} />
                            Удалить план
                        </Button>
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
