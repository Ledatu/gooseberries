// Tremor CategoryBar [v0.0.3]

'use client';
// Tremor chartColors [v0.1.0]

export type ColorUtility = 'bg' | 'stroke' | 'fill' | 'text';

export const chartColors = {
    blue: {
        bg: 'bg-blue-500',
        stroke: 'stroke-blue-500',
        fill: 'fill-blue-500',
        text: 'text-blue-500',
    },
    emerald: {
        bg: 'bg-emerald-500',
        stroke: 'stroke-emerald-500',
        fill: 'fill-emerald-500',
        text: 'text-emerald-500',
    },
    violet: {
        bg: 'bg-violet-500',
        stroke: 'stroke-violet-500',
        fill: 'fill-violet-500',
        text: 'text-violet-500',
    },
    amber: {
        bg: 'bg-amber-500',
        stroke: 'stroke-amber-500',
        fill: 'fill-amber-500',
        text: 'text-amber-500',
    },
    gray: {
        bg: 'bg-gray-500',
        stroke: 'stroke-gray-500',
        fill: 'fill-gray-500',
        text: 'text-gray-500',
    },
    cyan: {
        bg: 'bg-cyan-500',
        stroke: 'stroke-cyan-500',
        fill: 'fill-cyan-500',
        text: 'text-cyan-500',
    },
    pink: {
        bg: 'bg-pink-500',
        stroke: 'stroke-pink-500',
        fill: 'fill-pink-500',
        text: 'text-pink-500',
    },
    lime: {
        bg: 'bg-lime-500',
        stroke: 'stroke-lime-500',
        fill: 'fill-lime-500',
        text: 'text-lime-500',
    },
    fuchsia: {
        bg: 'bg-fuchsia-500',
        stroke: 'stroke-fuchsia-500',
        fill: 'fill-fuchsia-500',
        text: 'text-fuchsia-500',
    },
} as const satisfies {
    [color: string]: {
        [key in ColorUtility]: string;
    };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
    chartColors,
) as Array<AvailableChartColorsKeys>;

export const constructCategoryColors = (
    categories: string[],
    colors: AvailableChartColorsKeys[],
): Map<string, AvailableChartColorsKeys> => {
    const categoryColors = new Map<string, AvailableChartColorsKeys>();
    categories.forEach((category, index) => {
        categoryColors.set(category, colors[index % colors.length]);
    });
    return categoryColors;
};

export const getColorClassName = (color: AvailableChartColorsKeys, type: ColorUtility): string => {
    const fallbackColor = {
        bg: 'bg-gray-500',
        stroke: 'stroke-gray-500',
        fill: 'fill-gray-500',
        text: 'text-gray-500',
    };
    return chartColors[color]?.[type] ?? fallbackColor[type];
};

import React from 'react';

// import {
//   AvailableChartColors,
//   AvailableChartColorsKeys,
//   getColorClassName,
// } from "@/lib/chartUtils"
// import { cx } from "@/lib/utils"

// import { Tooltip } from "./Tooltip"

const getMarkerBgColor = (
    marker: number | undefined,
    values: number[],
    colors: AvailableChartColorsKeys[],
): string => {
    if (marker === undefined) return '';

    if (marker === 0) {
        for (let index = 0; index < values.length; index++) {
            if (values[index] > 0) {
                return getColorClassName(colors[index], 'bg');
            }
        }
    }

    let prefixSum = 0;
    for (let index = 0; index < values.length; index++) {
        prefixSum += values[index];
        if (prefixSum >= marker) {
            return getColorClassName(colors[index], 'bg');
        }
    }

    return getColorClassName(colors[values.length - 1], 'bg');
};

const getPositionLeft = (value: number | undefined, maxValue: number): number =>
    value ? (value / maxValue) * 100 : 0;

const sumNumericArray = (arr: number[]) => arr.reduce((prefixSum, num) => prefixSum + num, 0);

const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return num.toFixed(1);
};

const BarLabels = ({values}: {values: number[]}) => {
    const sumValues = React.useMemo(() => sumNumericArray(values), [values]);
    let prefixSum = 0;
    let sumConsecutiveHiddenLabels = 0;

    return (
        <div
            className={
                // base
                'relative mb-2 flex h-5 w-full text-sm font-medium text-gray-700 dark:text-gray-300'
            }
            style={
                {
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    '--tw-text-opacity': 1,
                    color: 'rgb(55 65 81 / var(--tw-text-opacity, 1))',
                    'font-weight': 500,
                    'font-size': '.875rem',
                    'line-height': '1.25rem',
                } as React.CSSProperties
            }
        >
            <div className="absolute bottom-0 left-0 flex items-center">0</div>
            {values.map((widthPercentage, index) => {
                prefixSum += widthPercentage;

                const showLabel =
                    (widthPercentage >= 0.1 * sumValues ||
                        sumConsecutiveHiddenLabels >= 0.09 * sumValues) &&
                    sumValues - prefixSum >= 0.1 * sumValues &&
                    prefixSum >= 0.1 * sumValues &&
                    prefixSum < 0.9 * sumValues;

                sumConsecutiveHiddenLabels = showLabel
                    ? 0
                    : (sumConsecutiveHiddenLabels += widthPercentage);

                const widthPositionLeft = getPositionLeft(widthPercentage, sumValues);

                return (
                    <div
                        key={`item-${index}`}
                        className="flex items-center justify-end pr-0.5"
                        style={{width: `${widthPositionLeft}%`}}
                    >
                        {showLabel ? (
                            <span className={'block translate-x-1/2 text-sm tabular-nums'}>
                                {formatNumber(prefixSum)}
                            </span>
                        ) : null}
                    </div>
                );
            })}
            <div className="absolute bottom-0 right-0 flex items-center">
                {formatNumber(sumValues)}
            </div>
        </div>
    );
};

interface CategoryBarProps extends React.HTMLAttributes<HTMLDivElement> {
    values: number[];
    colors?: AvailableChartColorsKeys[];
    marker?: {value: number; tooltip?: string; showAnimation?: boolean};
    showLabels?: boolean;
}

const CategoryBar = React.forwardRef<HTMLDivElement, CategoryBarProps>(
    (
        {
            values = [],
            colors = AvailableChartColors,
            marker,
            showLabels = true,
            className,
            ...props
        },
        forwardedRef,
    ) => {
        const markerBgColor = React.useMemo(
            () => getMarkerBgColor(marker?.value, values, colors),
            [marker, values, colors],
        );

        const maxValue = React.useMemo(() => sumNumericArray(values), [values]);

        const adjustedMarkerValue = React.useMemo(() => {
            if (marker === undefined) return undefined;
            if (marker.value < 0) return 0;
            if (marker.value > maxValue) return maxValue;
            return marker.value;
        }, [marker, maxValue]);

        const markerPositionLeft: number = React.useMemo(
            () => getPositionLeft(adjustedMarkerValue, maxValue),
            [adjustedMarkerValue, maxValue],
        );

        return (
            <div
                ref={forwardedRef}
                className={`${className}`}
                aria-label="Category bar"
                aria-valuenow={marker?.value}
                tremor-id="tremor-raw"
                {...props}
            >
                {showLabels ? <BarLabels values={values} /> : null}
                <div className="relative flex h-2 w-full items-center">
                    <div className="flex h-full flex-1 items-center gap-0.5 overflow-hidden rounded-full">
                        {values.map((value, index) => {
                            const barColor = colors[index] ?? 'gray';
                            const percentage = (value / maxValue) * 100;
                            return (
                                <div
                                    key={`item-${index}`}
                                    className={`h-full${getColorClassName(
                                        barColor as AvailableChartColorsKeys,
                                        'bg',
                                    )}${percentage === 0 && 'hidden'}`}
                                    style={{width: `${percentage}%`}}
                                />
                            );
                        })}
                    </div>

                    {marker !== undefined ? (
                        <div
                            className={`absolute w-2 -translate-x-1/2
                                ${
                                    marker.showAnimation &&
                                    'transform-gpu transition-all duration-300 ease-in-out'
                                }`}
                            style={{
                                left: `${markerPositionLeft}%`,
                            }}
                        >
                            {marker.tooltip ? (
                                <></>
                            ) : (
                                // <Tooltip asChild content={marker.tooltip}>
                                //     <div
                                //         aria-hidden="true"
                                //         className={cx(
                                //             'relative mx-auto h-4 w-1 rounded-full ring-2',
                                //             'ring-white dark:ring-gray-950',
                                //             markerBgColor,
                                //         )}
                                //     >
                                //         <div
                                //             aria-hidden
                                //             className="absolute size-7 -translate-x-[45%] -translate-y-[15%]"
                                //         ></div>
                                //     </div>
                                // </Tooltip>
                                <div
                                    className={`mx-auto h-4 w-1 rounded-full ring-2 ring-white dark:ring-gray-950${markerBgColor}`}
                                />
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    },
);

CategoryBar.displayName = 'CategoryBar';

export {CategoryBar, type CategoryBarProps};
