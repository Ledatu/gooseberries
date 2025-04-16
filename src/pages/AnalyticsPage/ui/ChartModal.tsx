import {Button, Card, Icon, List, Modal, Text} from '@gravity-ui/uikit';
import ChartKit from '@gravity-ui/chartkit';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {TrashBin} from '@gravity-ui/icons';
import {Dispatch, FC, SetStateAction} from 'react';
import {colors} from '@/pages/AnalyticsPage/config/colors';

interface AnalyticChartModalProps {
    graphModalOpen: boolean;
    setGraphModalOpen: Dispatch<SetStateAction<boolean>>;
    setCurrenrGraphMetrics: any;
    setGraphModalData: any;
    setGraphModalTimeline: any;
    setGraphModalTitle: any;
    genYagrData: any;
    graphModalData: any;
    columnDataReversed: any;
    currenrGraphMetrics: any;
}

export const AnalyticChartModal: FC<AnalyticChartModalProps> = ({
    graphModalOpen,
    setGraphModalOpen,
    setCurrenrGraphMetrics,
    setGraphModalData,
    setGraphModalTimeline,
    setGraphModalTitle,
    genYagrData,
    graphModalData,
    columnDataReversed,
    currenrGraphMetrics,
}) => {
    return (
        <Modal
            open={graphModalOpen}
            onClose={() => {
                setGraphModalOpen(false);
                setCurrenrGraphMetrics([]);
                setGraphModalData({});
                setGraphModalTimeline([]);
                setGraphModalTitle('');
            }}
        >
            <Card
                view="outlined"
                theme="warning"
                style={{
                    height: '50em',
                    width: '90em',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <ChartKit type="yagr" data={genYagrData() as YagrWidgetData} />
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
                            const selected = currenrGraphMetrics.includes(columnDataReversed[item]);
                            const graphColor =
                                colors[
                                    currenrGraphMetrics.indexOf(columnDataReversed[item]) %
                                        colors.length
                                ];
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
                            let tempArr = Array.from(currenrGraphMetrics);
                            if (tempArr.includes(metricVal)) {
                                tempArr = tempArr.filter((value) => value != metricVal);
                            } else {
                                tempArr.push(metricVal);
                            }

                            tempArr = tempArr.sort((a: any, b: any) => {
                                const metricDataA = graphModalData[a];
                                const metricDataB = graphModalData[b];
                                return metricDataA[0] - metricDataB[0];
                            });

                            setCurrenrGraphMetrics(tempArr);
                        }}
                    />
                    <Button
                        width="max"
                        view={currenrGraphMetrics.length ? 'flat-danger' : 'normal'}
                        selected={currenrGraphMetrics.length != 0}
                        onClick={() => {
                            setCurrenrGraphMetrics([]);
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
    );
};
