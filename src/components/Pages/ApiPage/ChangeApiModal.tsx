'use client';

import {Button, Card, Modal, TextInput, Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, useState, cloneElement} from 'react';
import {useUser} from '@/components/RequireAuth/RequireAuth';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';

interface ChangeApiModalInterface {
    sellerId: string;
    children: ReactElement | ReactElement[];
}

export const ChangeApiModal = ({sellerId, children}: ChangeApiModalInterface) => {
    const {showError} = useError();
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

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <Modal open={open} onClose={handleClose}>
                <Card
                    view="clear"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%',
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        animate={{height: open ? 82 : 0}}
                        style={{
                            overflow: 'hidden',
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backdropFilter: 'blur(48px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
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
                            onClick={async () => {
                                const params = {
                                    user_id: user?._id,
                                    seller_id: sellerId,
                                    apiKey: key,
                                };

                                try {
                                    await ApiClient.post('auth/update-api-key', params);
                                    refetchUser();
                                } catch (error: any) {
                                    showError(
                                        error.response?.data?.error ||
                                            'Не удалось обновить АПИ токен.',
                                    );
                                }
                                handleClose();
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
