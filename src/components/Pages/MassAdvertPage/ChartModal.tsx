'use client';

import ChartKit from '@gravity-ui/chartkit';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {Card, Loader, Modal} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, useState, cloneElement} from 'react';

interface ChartModalInterface {
    children: ReactElement | ReactElement[];
    data?: YagrWidgetData;
    fetchingFunction?: () => Promise<YagrWidgetData>;
    addTime?: boolean;
}

export const ChartModal = ({children, data, fetchingFunction, addTime}: ChartModalInterface) => {
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
                // Optionally, handle the error state here
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

    const handleClose = () => {
        setOpen(false);
        setYagrData(null);
    };

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
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
            <Modal open={open} onClose={handleClose}>
                <Card
                    view="outlined"
                    theme="warning"
                    style={{
                        height: '48em',
                        width: '72em',
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
                            <ChartKit type="yagr" data={yagrData} />
                        ) : (
                            <p>No data available.</p>
                        )}
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
