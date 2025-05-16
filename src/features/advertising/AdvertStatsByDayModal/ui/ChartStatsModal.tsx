import {Graphic} from '@/shared/Graphic';
import {getStatsForChart} from '../hooks/getStatsForChart';
import {AdvertDateData} from '../types';
import {ReactElement, useEffect, useState, Children, isValidElement, cloneElement} from 'react';
import {ModalWindow} from '@/shared/ui/Modal';
import {motion} from 'framer-motion';
import {Loader} from '@gravity-ui/uikit';
import {nameOfColumns} from '../config/nameOfColumns';

interface ChartStatsModal {
    children: ReactElement | ReactElement[];
    defaultStat: string;
    stats: AdvertDateData[];
    useVerticalLines?: boolean;
}

export const ChartStatsModal = ({
    defaultStat,
    stats,
    children,
    useVerticalLines,
}: ChartStatsModal) => {
    const [open, setOpen] = useState(false);
    const [hiddenByDefault, setHiddenByDefault] = useState({});
    useEffect(() => {
        let obj: Record<string, boolean> = {};
        for (const key of Object.keys(nameOfColumns)) {
            if (key === defaultStat) {
                obj[nameOfColumns[key]] = false;
            } else {
                obj[nameOfColumns[key]] = true;
            }
        }
        setHiddenByDefault(obj);
        console.log(obj);
    }, [defaultStat]);
    const [data, setData] = useState<Record<string, string | number>[]>([]);
    useEffect(() => {
        if (open) {
            setData(getStatsForChart(stats));
        }
    }, [open]);

    const handleClose = () => {
        setOpen(false);
        setData([]);
    };
    const axisY = Object.fromEntries(Object.entries(nameOfColumns).map(([key, name]) => [name, key]));
    axisY[`${nameOfColumns[defaultStat]}`] = `${defaultStat}_scale`;
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
        onClick: () => setOpen(true),
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
                        animate={{display: !open ? 'flex' : 'none'}}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: !open ? '100%' : 0,
                            height: !open ? '100%' : 0,
                            background: 'var(--g-color-base-background)',
                        }}
                    >
                        {!open && <Loader size="l" />}
                    </motion.div>
                    <motion.div
                        animate={{opacity: !open ? 0 : 1}}
                        transition={{duration: 0.2, ease: 'easeIn'}}
                        style={{
                            display: !open ? 'none' : 'flex',
                            pointerEvents: !open ? 'none' : undefined,
                            cursor: 'default',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {data ? (
                            <Graphic
                                useVerticalLines={useVerticalLines}
                                className={'p-5'}
                                data={data}
                                yAxes={axisY}
                                // colors={colors}
                                hiddenByDefault={hiddenByDefault}
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
