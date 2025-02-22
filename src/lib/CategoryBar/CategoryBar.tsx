// Tremor CategoryBar [v0.0.3]

'use client';

import React, {useMemo} from 'react';

import {AvailableChartColorsKeys, getColorClassName} from '@/lib/chartUtils';
import {cx} from '@/lib/utils';

// import {Tooltip} from '../Tooltip';
import {Text} from '@gravity-ui/uikit';

// const getMarkerBgColor = (
//     marker: number | undefined,
//     values: number[],
//     colors: AvailableChartColorsKeys[],
// ): string => {
//     if (marker === undefined) return '';

//     if (marker === 0) {
//         for (let index = 0; index < values.length; index++) {
//             if (values[index] > 0) {
//                 return getColorClassName(colors[index], 'bg');
//             }
//         }
//     }

//     let prefixSum = 0;
//     for (let index = 0; index < values.length; index++) {
//         prefixSum += values[index];
//         if (prefixSum >= marker) {
//             return getColorClassName(colors[index], 'bg');
//         }
//     }

//     return getColorClassName(colors[values.length - 1], 'bg');
// };

const getSamePositionLeft = (count: number, maxValue: number): number =>
    count ? (maxValue / count / maxValue) * 100 : 0;

const getPositionLeft = (value: number | undefined, maxValue: number): number =>
    value ? (value / maxValue) * 100 : 0;

const sumNumericArray = (arr: number[]) => arr.reduce((prefixSum, num) => prefixSum + num, 0);

// const formatNumber = (num: number): string => {
//     if (Number.isInteger(num)) {
//         return num.toString();
//     }
//     return num.toFixed(1);
// };

interface BarLabelsProps {
    values: number[];
    isSameParts?: boolean;
}

interface BarFotterLabels {
    footerValues: number[] | string[];
    positions: any[];
    isSameParts?: boolean;
}

const BarFotterLabels = ({footerValues, positions}: BarFotterLabels) => {
    return (
        <div
            className={cx(
                // base
                'relative mb-2 flex h-5 w-full text-sm font-medium',
                // text color
                'text-gray-700 dark:text-gray-300',
            )}
        >
            <div className="absolute bottom-0 left-0 flex items-center">
                <Text variant="subheader-1" className={cx('block translate-x-1/2 tabular-nums')}>
                    +0%
                </Text>
            </div>
            {footerValues.map((footerValue, index) => {
                const widthPositionLeft = positions[index];

                return (
                    <div
                        key={`item-${index}`}
                        className="flex items-center justify-end pr-0.5"
                        style={{
                            width: `calc(${widthPositionLeft}%)`,
                        }}
                    >
                        <Text
                            variant="subheader-1"
                            className={cx('block translate-x-1/2 tabular-nums')}
                        >
                            +{footerValue}%
                        </Text>
                    </div>
                );
            })}
        </div>
    );
};

const getPositionForMarker = (markerValue: number | undefined, positions: any[], values: any[]) => {
    let widths = 0;
    let index = 0;
    for (const value of values) {
        if ((markerValue ? markerValue : 0) > value) {
            widths += positions[index++];
        } else {
            const lastValue = index - 1 >= 0 ? values[index - 1] : 0;
            const percent =
                (((markerValue ?? 0) - (lastValue ?? 0)) / (value - lastValue)) * positions[index];
            console.log(lastValue, percent, value, 'adl;sk;dksa');
            widths += percent;
            break;
        }
    }
    return widths;
};
const BarLabels = ({values, isSameParts = true}: BarLabelsProps) => {
    const sumValues = React.useMemo(() => sumNumericArray(values), [values]);
    // let sumConsecutiveHiddenLabels = 0;

    return (
        <div
            className={cx(
                // base
                'relative mb-2 flex h-5 w-full text-sm font-medium',
                // text color
                'text-gray-700 dark:text-gray-300',
            )}
        >
            <div className="absolute bottom-0 left-0 flex items-center">
                <Text variant="subheader-1" className={cx('block translate-x-1/2 tabular-nums')}>
                    0шт.
                </Text>
            </div>
            {values.map((widthPercentage, index) => {
                if (index - 1 == values.length) return;
                const widthPositionLeft = isSameParts
                    ? getSamePositionLeft(values.length, sumValues) + 8
                    : getPositionLeft(widthPercentage, sumValues);

                return (
                    <div
                        key={`item-${index}`}
                        className="flex items-center justify-end pr-0.5"
                        style={{
                            width: `calc(${widthPositionLeft}%)`,
                        }}
                    >
                        <Text
                            variant="subheader-1"
                            className={cx('block translate-x-1/2 tabular-nums')}
                        >
                            {widthPercentage}шт.
                        </Text>
                        {/* <span className={cx('block translate-x-1/2 text-sm tabular-nums')}>
                            {widthPercentage}
                            {}
                        </span> */}
                    </div>
                );
            })}
            <div className="absolute bottom-0 right-0 flex items-center">
                {/* <Text style={{left: 20}}>{sumValues}</Text> */}
            </div>
        </div>
    );
};

interface CategoryBarProps extends React.HTMLAttributes<HTMLDivElement> {
    values: number[];
    colors?: AvailableChartColorsKeys[];
    footerValues?: string[] | number[];
    isValuesBottom?: true;
    marker?: {value: number; tooltip?: string; showAnimation?: boolean};
    showLabels?: boolean;
    isSameParts?: boolean;
}

const CategoryBar = React.forwardRef<HTMLDivElement, CategoryBarProps>(
    (
        {
            values = [],
            footerValues = [],
            isValuesBottom = true,
            colors = [],
            marker,
            showLabels = true,
            className,
            isSameParts = true,
            ...props
        },
        forwardedRef,
    ) => {
        // const markerBgColor = React.useMemo(
        //     () => getMarkerBgColor(marker?.value, values, colors),
        //     [marker, values, colors],
        // );

        const maxValue = React.useMemo(() => sumNumericArray(values), [values]);
        const positions = values.map((value) => {
            const percentage = isSameParts ? 100 / values.length : (value / maxValue) * 100;
            return percentage;
        });
        const adjustedMarkerValue = React.useMemo(() => {
            if (marker === undefined) return undefined;
            if (marker.value < 0) return 0;
            if (marker.value > maxValue) return maxValue;
            return marker.value;
        }, [marker, maxValue]);

        const markerPositionLeft: number = React.useMemo(
            () =>
                isSameParts
                    ? getPositionForMarker(marker?.value, positions, values)
                    : getPositionLeft(adjustedMarkerValue, maxValue),
            [adjustedMarkerValue, maxValue],
        );
        // const [lastWidth, setLastWidth] = useState(0);
        const lastWidth = useMemo(() => {
            let width = 0;
            values.map((value) => {
                if (!((marker?.value ? marker?.value : 0) < value)) {
                    const percentage = isSameParts ? 100 / values.length : (value / maxValue) * 100;
                    width += percentage;
                }
            });
            return width;
        }, [values]);

        return (
            <div
                ref={forwardedRef}
                className={cx(className)}
                aria-label="Category bar"
                aria-valuenow={marker?.value}
                tremor-id="tremor-raw"
                {...props}
                style={{width: '100%', marginInlineEnd: '64px', maxWidth: '85%'}}
            >
                {showLabels ? <BarLabels values={values} /> : null}
                <div className="relative flex h-2 w-full items-center">
                    <div className="flex h-full flex-1 items-center gap-0.5 overflow-hidden rounded-full transform-gpu transition-all duration-300 ease-in-out">
                        {values.map((value, index) => {
                            const barColor: AvailableChartColorsKeys =
                                colors[index] ??
                                ((marker?.value ? marker?.value : 0) < value
                                    ? 'lightWhite'
                                    : 'green');
                            // if (!((marker?.value ? marker?.value : 0) < value)) setLastWidth(value);
                            const percentage = isSameParts
                                ? 100 / values.length
                                : (value / maxValue) * 100;
                            return (
                                <div
                                    key={`item-${index}`}
                                    className={cx(
                                        'h-full',
                                        getColorClassName(
                                            barColor as AvailableChartColorsKeys,
                                            'bg',
                                        ),
                                        percentage === 0 && 'hidden',
                                    )}
                                    style={{
                                        width: `${percentage}%`,
                                        background: getColorClassName(
                                            barColor as AvailableChartColorsKeys,
                                            'bg',
                                        ),
                                    }}
                                />
                            );
                        })}
                        <div
                            key={`item-${values.length}`}
                            className={cx('h-full')}
                            style={{
                                position: 'absolute',
                                left: `${lastWidth}%`,
                                width: `${markerPositionLeft - lastWidth}%`,
                                background: 'rgba(92, 211, 186, 0.433)',
                            }}
                        />
                    </div>

                    {marker !== undefined ? (
                        <div
                            className={cx(
                                'absolute w-2 -translate-x-1/2',
                                marker.showAnimation &&
                                    'transform-gpu transition-all duration-300 ease-in-out',
                            )}
                            style={{
                                left: `${markerPositionLeft}%`,
                            }}
                        >
                            <div
                                style={{
                                    width: 'max-content',
                                    background: '#4db09b',
                                }}
                                className={cx(
                                    'mx-auto h-4 w-1 rounded-full ring-1',
                                    'ring-white dark:ring-gray-950',
                                )}
                            >
                                <Text variant="subheader-1" style={{margin: '8px'}}>
                                    {marker.value}
                                </Text>
                            </div>
                        </div>
                    ) : null}
                </div>
                <div style={{marginTop: '8px'}}>
                    {showLabels ? (
                        <BarFotterLabels footerValues={footerValues} positions={positions} />
                    ) : null}
                </div>
            </div>
        );
    },
);

CategoryBar.displayName = 'CategoryBar';

export {CategoryBar, type CategoryBarProps};
