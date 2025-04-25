'use client';

import {Graphic, MinMaxValue} from '@/shared/Graphic';
import {ModalWindow} from '@/shared/ui/Modal';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {Loader} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, useState, cloneElement, FC} from 'react';

interface ChartModalInterface {
    children: ReactElement | ReactElement[];
    data?: YagrWidgetData;
    fetchingFunction?: () => Promise<YagrWidgetData>;
    addTime?: boolean;
    colors?: Record<string, string>;
    extraYAxes?: {[key: string]: string};
    minMaxValues?: MinMaxValue;
}

export const ChartModal: FC<ChartModalInterface> = ({
    children,
    data,
    fetchingFunction,
    addTime,
    extraYAxes,
    colors,
    minMaxValues,
}) => {
    const [open, setOpen] = useState(false);
    const [dataFetching, setDataFetching] = useState(false);
    const [yagrData, setYagrData] = useState<YagrWidgetData | null>(data ?? null);

    const handleOpen = async () => {
        setOpen(true);
        let tempData = undefined as any;
        if (!yagrData && fetchingFunction) {
            setDataFetching(true);
            try {
                tempData = await fetchingFunction();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setDataFetching(false);
            }
        } else if (!yagrData && data) tempData = data;

        if (addTime !== false && tempData) {
            const timeline = tempData.data.timeline;
            tempData.data.graphs.push({
                id: '4',
                name: 'Дата и время',
                cursorOptions: {markersSize: 0},
                scale: 'time',
                color: '#0000',
                data: timeline,
                formatter: (value: any) => new Date(value as number).toLocaleString('ru-RU') ?? '',
            });
        }

        setYagrData(tempData);
    };

    const calculateGraphicData = (): Record<string, number>[] => {
        const graphicData: Record<string, number>[] = [];
        if (!yagrData) {
            return [];
        }

        for (let i = 0; i < yagrData.data.timeline.length; i++) {
            const dataPoint: Record<string, number | string> = {};

            for (let j = 0; j < yagrData.data.graphs.length; j++) {
                const graph: any = yagrData.data.graphs[j];
                dataPoint[graph.name] = graph.data[i];
            }

            graphicData.push(dataPoint as any);
        }

        return graphicData;
    };

    const handleClose = () => {
        setOpen(false);
        setYagrData(null);
    };

    const childArray = Children.toArray(children);

    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('ChartModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <ModalWindow padding={false} isOpen={open} handleClose={handleClose}>
                <div
                    style={{
                        width: '60vw',
                        height: '55vh',
                        overflow: 'auto',
                        display: 'flex',
                        position: 'relative',
                    }}
                >
                    <motion.div
                        animate={{display: dataFetching ? 'flex' : 'none'}}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: dataFetching ? '100%' : 0,
                            height: dataFetching ? '100%' : 0,
                            background: 'var(--g-color-base-background)',
                        }}
                    >
                        {dataFetching && <Loader size="l" />}
                    </motion.div>
                    <motion.div
                        animate={{opacity: dataFetching ? 0 : 1}}
                        transition={{duration: 0.2, ease: 'easeIn'}}
                        style={{
                            display: dataFetching ? 'none' : 'flex',
                            pointerEvents: dataFetching ? 'none' : undefined,
                            cursor: 'default',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {yagrData ? (
                            <Graphic
                                className={'p-5'}
                                data={calculateGraphicData()}
                                yAxes={extraYAxes}
                                colors={colors}
                                removedEntities={['CR']}
                                minMaxValues={minMaxValues}
                            />
                        ) : (
                            <p>No data available.</p>
                        )}
                    </motion.div>
                </div>
            </ModalWindow>
        </>
    );
};
