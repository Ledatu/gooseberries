import {Button, Card, Modal, TextInput, Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import callApi from 'src/utilities/callApi';
import {useUser} from './RequireAuth';

interface AddApiModalInterface {
    children: ReactElement | ReactElement[];
}

export const AddApiModal = ({children}: AddApiModalInterface) => {
    const {user} = useUser();
    const [open, setOpen] = useState(false);

    const [name, setName] = useState('');
    const [key, setKey] = useState('');

    const handleOpen = async () => {
        setOpen(true);
        setName('');
        setKey('');
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <Modal open={open} onClose={handleClose}>
                <Card>
                    <motion.div
                        animate={{height: open ? 126 : 0}}
                        style={{
                            height: 0,
                            width: 300,
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            justifyContent: 'space-between',
                        }}
                    >
                        <TextInput
                            value={name}
                            onUpdate={(val) => setName(val)}
                            size="l"
                            placeholder="Введите название магазина"
                        />
                        <TextInput
                            value={key}
                            onUpdate={(val) => setKey(val)}
                            size="l"
                            placeholder="Вставьте API ключ"
                        />
                        <Button
                            size="l"
                            view="outlined-success"
                            selected
                            disabled={name === '' || key === ''}
                            onClick={() => {
                                const params = {
                                    user_id: user?._id,
                                    campaignName: name,
                                    apiKey: key,
                                };
                                callApi('createCampaign', params, false, true)
                                    .catch((e) => {
                                        alert(e);
                                    })
                                    .finally(() => handleClose());
                            }}
                        >
                            <Text variant="subheader-1">Добавить магазин</Text>
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
