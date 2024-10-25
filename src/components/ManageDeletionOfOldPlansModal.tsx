import {Button, Icon, Modal, Select, Text, List} from '@gravity-ui/uikit';
import React, {useEffect, useState} from 'react';
import {TrashBin, ListCheck} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';
import callApi, {getUid} from 'src/utilities/callApi';
import {getMonth} from 'src/utilities/getRoundValue';

export const ManageDeletionOfOldPlansModal = ({
    disabled,
    selectValue,
    doc,
    setChangedDoc,
    columnDataReversed,
    colors,
    dateRange,
    filteredData,
}: {
    disabled: boolean;
    selectValue: string[];
    doc: object;
    setChangedDoc: Function;
    columnDataReversed: object;
    colors: string[];
    dateRange: Date[];
    filteredData: any[];
}) => {
    const [open, setOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [currenrPlanModalMetrics, setCurrenrPlanModalMetrics] = useState([] as any[]);
    const [selectedButton, setSelectedButton] = useState('');

    const [selectedMonth, setSelectedMonth] = useState([] as any[]);
    useEffect(() => {
        console.log(doc, setChangedDoc);
    }, [selectValue]);

    const [monthNames, setMonthNames] = useState([] as any[]);
    const [selectOptions, setSelectOptions] = useState([] as any[]);
    useEffect(() => {
        if (!dateRange || !dateRange[0] || !dateRange[1] || !open) setSelectOptions([] as any[]);
        const result = ['Все месяцы диапазона'];

        const date = new Date(dateRange[0]);
        for (;;) {
            const month = getMonth(date);
            if (!result.includes(month)) result.push(month);
            // console.log(date, dateRange[0], dateRange[1]);
            date.setDate(date.getDate() + 1);
            if (date > new Date(dateRange[1])) break;
        }

        setMonthNames(result);
        setSelectOptions(
            result.map((item) => {
                return {content: item, value: item};
            }),
        );
    }, [dateRange]);

    useEffect(() => {
        setCurrentStep(0);
        setCurrenrPlanModalMetrics([] as any[]);
        setSelectedMonth([] as any[]);
    }, [open]);

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
                disabled={disabled}
                view="action"
                size="l"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <Icon data={TrashBin} />
                <Text variant="subheader-1">Удалить планы</Text>
            </Button>
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <motion.div
                    style={{
                        width: 300,
                        margin: 20,
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        animate={{height: currentStep < 2 ? 48 : 0}}
                        style={{
                            overflow: 'hidden',
                            height: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end',
                            width: '100%',
                        }}
                    >
                        <Select
                            size="l"
                            width="max"
                            options={selectOptions}
                            value={selectedMonth}
                            onUpdate={(opt) => {
                                setSelectedMonth(opt);
                                setCurrentStep(1);
                            }}
                            placeholder={'Выберите месяц'}
                        />
                    </motion.div>
                    <motion.div
                        animate={{
                            height: currentStep > 0 ? 450 : 0,
                            marginTop: currentStep > 0 ? 8 : 0,
                        }}
                        style={{
                            marginTop: 0,
                            height: 0,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <List
                            size="l"
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
                            style={{marginTop: 8}}
                            width="max"
                            view={'outlined-info'}
                            selected={
                                currenrPlanModalMetrics.length ==
                                Object.values(columnDataReversed).length
                            }
                            onClick={() => {
                                setCurrenrPlanModalMetrics(
                                    currenrPlanModalMetrics.length ==
                                        Object.values(columnDataReversed).length
                                        ? ([] as any[])
                                        : Object.values(columnDataReversed),
                                );
                            }}
                            pin="circle-circle"
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                <Icon data={ListCheck} />
                                <div style={{minWidth: 3}} />
                                Выбрать все
                            </div>
                        </Button>
                    </motion.div>
                    <motion.div
                        animate={{
                            height: currentStep < 3 ? 40 : 0,
                            marginTop: currentStep < 3 ? 8 : 0,
                        }}
                        style={{height: 36, overflow: 'hidden', width: '100%', marginTop: 0}}
                    >
                        {generateModalButtonWithActions(
                            {
                                onClick: () => {
                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        monthNames:
                                            selectedMonth[0] == monthNames[0]
                                                ? monthNames
                                                : selectedMonth,
                                        metrics: currenrPlanModalMetrics,
                                        entities: [] as any[],
                                    };
                                    for (const row of filteredData) {
                                        const {entity} = row;
                                        if (!params.entities.includes(entity))
                                            params.entities.push(entity);
                                    }
                                    console.log(params);

                                    callApi('deletePlansForMonth', params)
                                        .then((res) => {
                                            if (!res || !res['data']) return;
                                            doc['plansData'][selectValue[0]] = res['data'];
                                            setChangedDoc({...doc});
                                        })
                                        .finally(() => {
                                            setOpen(false);
                                        });
                                },
                                view: 'outlined-danger',
                                disabled: !currenrPlanModalMetrics.length,
                                placeholder: 'Удалить планы',
                                icon: TrashBin,
                            },
                            selectedButton,
                            setSelectedButton,
                        )}
                    </motion.div>
                </motion.div>
            </Modal>
        </div>
    );
};
