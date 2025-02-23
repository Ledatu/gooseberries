import {Card, Modal} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {FC, ReactNode} from 'react';

interface ModalWindowProps {
    isOpen: boolean;
    handleClose: () => void;
    children?: ReactNode;
}

export const ModalWindow: FC<ModalWindowProps> = ({isOpen, handleClose, children}) => {
    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Card
                view="clear"
                className="w-[300px] absolute top-1/2 left-1/2 transform -translate-x-1/2
                -translate-y-1/2 flex flex-row items-center justify-between bg-transparent"
            >
                <motion.div
                    className="overflow-hidden flex flex-col items-center justify-between bg-[#221d220f]
                        backdrop-blur-sm shadow-md p-[30px] rounded-[30px] border border-[#eee2]"
                >
                    {children}
                </motion.div>
            </Card>
        </Modal>
    );
};
