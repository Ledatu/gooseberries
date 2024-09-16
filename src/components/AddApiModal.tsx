import {Button, Card, Modal, TextInput, Text, Link, Popover} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useState} from 'react';
import callApi from 'src/utilities/callApi';
import {useUser} from './RequireAuth';
import screen from '../assets/api-key.jpg';

interface AddApiModalInterface {
    children: ReactElement | ReactElement[];
}

export const AddApiModal = ({children}: AddApiModalInterface) => {
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
                <Card>
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
                                    .catch((e) => {
                                        alert(e);
                                    })
                                    .finally(() => handleClose());
                            }}
                        >
                            <Text variant="subheader-1">Добавить магазин</Text>
                        </Button>
                        <Text style={{margin: '0 16px'}} variant="caption-2" color="secondary">
                            Получение данных после добавления API токена обычно занимает около трех
                            часов, пожалуйста, подождите перед использованием.
                        </Text>
                        <Popover
                            delayOpening={0}
                            placement={'bottom'}
                            content={
                                <Card
                                    view="clear"
                                    style={{
                                        height: 20,
                                        overflow: 'auto',
                                        display: 'flex',
                                    }}
                                >
                                    <Card
                                        style={{
                                            background: 'var(--g-color-base-background)',
                                            position: 'absolute',
                                            height: 400,
                                            width: 400,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            top: -1,
                                            left: -184,
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
                                </Card>
                            }
                        >
                            <Link
                                href="https://seller.wildberries.ru/supplier-settings/access-to-api"
                                target="_blank"
                            >
                                Сгенерируйте API токен здесь
                            </Link>
                        </Popover>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
