import {Card, Modal} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {FC, ReactNode} from 'react';
import {cn} from '@/lib/cn';

interface ModalWindowProps {
    isOpen: boolean;
    handleClose: () => void;
    children?: ReactNode;
    cardClassName?: string;
    motionDivClassName?: string;
}

export const ModalWindow: FC<ModalWindowProps> = ({
    isOpen,
    handleClose,
    children,
    motionDivClassName,
    cardClassName,
}) => {
    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Card
                view="clear"
                className={cn(
                    'absolute top-1/2 left-1/2 transform -translate-x-1/2',
                    '-translate-y-1/2 flex flex-row items-center justify-between bg-transparent',
                    cardClassName,
                )}
            >
                <motion.div
                    className={cn(
                        'overflow-hidden flex flex-col items-center justify-between bg-[#221d220f]',
                        'backdrop-blur-2xl shadow-md p-[30px] rounded-[30px] border border-[#eee2]',
                        motionDivClassName,
                    )}
                >
                    {children}
                </motion.div>
            </Card>
        </Modal>
    );
};
