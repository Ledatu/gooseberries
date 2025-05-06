import {Tooltip, TooltipPositionerFunction} from 'chart.js';

declare module 'chart.js' {
    interface TooltipPositionerMap {
        // @ts-ignore
        nextTo: TooltipPositionerFunction<'nextTo'>;
    }
}

export const registerNextToPositioner = () => {
    Tooltip.positioners.nextTo = function (_elements, eventPosition) {
        const width = (this as any).width ?? 100;
        return {
            x: eventPosition.x - width - 10,
            y: eventPosition.y,
            xAlign: 'left',
            yAlign: 'center',
        };
    };
};
