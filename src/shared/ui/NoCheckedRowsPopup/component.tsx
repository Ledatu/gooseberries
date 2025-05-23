import {useState} from 'react';
import {ModalWindow} from '../Modal';
import {Text} from '@gravity-ui/uikit';

export const useNoCheckedRowsPopup = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return {
        openNoCheckedRowsPopup: handleOpen,
        NoCheckedRowsPopup: (
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <Text variant="header-1">
                    Перед редактированием или выполнением массовых действий <br />
                    отметьте нужные строки с помощью чекбоксов.
                </Text>
            </ModalWindow>
        ),
    };
};
