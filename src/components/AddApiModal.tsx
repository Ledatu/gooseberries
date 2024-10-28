import {Button, Card, Modal, TextInput, Text, Link} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import callApi from 'src/utilities/callApi';
import {useUser} from './RequireAuth';
import screen from '../assets/api-key.jpg';
import {useError} from 'src/pages/ErrorContext';

interface AddApiModalInterface {
    children: ReactElement | ReactElement[];
}

export const AddApiModal = ({children}: AddApiModalInterface) => {
    const {showError} = useError(); // Access error context

    const {userInfo, refetchUser} = useUser();
    const {user} = userInfo ?? {};
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
                <Card
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Card
                        style={{
                            background: 'var(--g-color-base-background)',
                            height: 300,
                            width: 300,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                borderRadius: 9,
                                overflow: 'hidden',
                            }}
                        >
                            <img src={screen} style={{height: '100%'}} />
                        </div>
                    </Card>
                    <Text
                        variant="caption-2"
                        color="secondary"
                        style={{
                            margin: '8px',
                        }}
                    >
                        Так должны выглядеть настройки API токена.
                    </Text>
                    <motion.div
                        animate={{height: open ? 208 : 0}}
                        style={{
                            height: 0,
                            width: 300,
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
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
                            placeholder="Вставьте API токен"
                        />
                        <Button
                            width="max"
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
                                    .then(() => {
                                        refetchUser();
                                    })
                                    .catch((error) => {
                                        showError(
                                            error.response?.data?.error ||
                                                'An unknown error occurred',
                                        );
                                    })
                                    .finally(() => handleClose());
                            }}
                        >
                            <Text variant="subheader-1">Добавить магазин</Text>
                        </Button>
                        <Text style={{margin: '0 16px'}} variant="caption-2" color="secondary">
                            Вы можете начать работать уже через 30 минут, а через 3 часа вам будет
                            доступна подробная статистика за последние 90 дней!
                        </Text>
                        <Link
                            href="https://seller.wildberries.ru/supplier-settings/access-to-api"
                            target="_blank"
                        >
                            Сгенерируйте API токен здесь
                        </Link>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
