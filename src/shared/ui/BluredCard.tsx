import {Card, CSSProperties} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {FC, ReactNode} from 'react';
import {cn} from '@/lib/cn';

interface BluredCardProps {
    // handleClose: () => void;
    width?: number;
    heigth?: number;
    children?: ReactNode;
    cardClassName?: string;
	motionDivStyle?: CSSProperties
    motionDivClassName?: string;
    padding?: boolean;
}

export const BluredCard: FC<BluredCardProps> = ({
    width,
    heigth,
    children,
    motionDivClassName,
	motionDivStyle,
    cardClassName,
    padding = true,
}) => {
    return (
        <Card
            view="clear"
            className={cn(
                'absolute',
                'flex flex-row items-center justify-between bg-transparent',
                cardClassName,
            )}
            width={width}
            height={heigth}
        >
            <motion.div
                className={cn(
                    'overflow-hidden flex flex-col items-center justify-between',
                    `bg-[#221d220f] backdrop-blur-2xl shadow-md ${padding ? 'p-[30px]' : ''} rounded-[30px] border border-[#eee2]`,
                    'supports-[backdrop-filter]:bg-[#221d220f] supports-not-[backdrop-filter]:bg-[#221d2233]',
                    motionDivClassName,
                )}
				style={motionDivStyle}
            >
                {children}
            </motion.div>
        </Card>
    );
};
