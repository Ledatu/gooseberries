import {Button, Card, Modal, TextInput, Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import callApi from 'src/utilities/callApi';
import {useUser} from './RequireAuth';

interface ChangeApiModalInterface {
    sellerId: string;
    children: ReactElement | ReactElement[];
}

export const ChangeApiModal = ({sellerId, children}: ChangeApiModalInterface) => {
    const {userInfo, refetchUser} = useUser();
    const {user} = userInfo ?? {};
    const [open, setOpen] = useState(false);

    const [key, setKey] = useState('');

    const handleOpen = async () => {
        setOpen(true);
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
                        animate={{height: open ? 82 : 0}}
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
                            value={key}
                            onUpdate={(val) => setKey(val)}
                            size="l"
                            placeholder="Вставьте API ключ"
                        />
                        <Button
                            size="l"
                            view="outlined-success"
                            selected
                            disabled={key === ''}
                            onClick={() => {
                                const params = {
                                    user_id: user?._id,
                                    seller_id: sellerId,
                                    apiKey: key,
                                };
                                callApi('updateCampaignAPIKey', params, false, true)
                                    .then(() => {
                                        refetchUser();
                                    })
                                    .catch((e) => {
                                        alert(e);
                                    })
                                    .finally(() => handleClose());
                            }}
                        >
                            <Text variant="subheader-1">Изменить API магазина</Text>
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
