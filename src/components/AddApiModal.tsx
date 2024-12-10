import {Button, Card, Modal, TextInput, Text, Link} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useMemo, useState} from 'react';
import {useUser} from './RequireAuth';
// import screen from '../assets/api-key.jpg';
import {useError} from 'src/pages/ErrorContext';
import ApiClient from 'src/utilities/ApiClient';
import {PasteTextField} from './PasteTextField';
import {TextTitleWrapper} from './TextTitleWrapper';

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
    const [readKey, setReadKey] = useState('');

    const [sellerId, setSellerId] = useState('');

    const [modules, setModules] = useState({
        content: {name: 'Контент', presented: false, readOnly: false},
        analytics: {name: 'Аналитика', presented: false, readOnly: false},
        prices_and_discounts: {name: 'Цены и скидки', presented: false, readOnly: false},
        marketplace: {name: 'Маркетплейс', presented: false, readOnly: false},
        statistics: {name: 'Статистика', presented: false, readOnly: false},
        promotion: {name: 'Продвижение', presented: false, readOnly: false},
        questions_and_feedbacks: {name: 'Вопросы и отзывы', presented: false, readOnly: false},
    });

    const modulesValid = useMemo(() => {
        for (const [_, data] of Object.entries(modules)) {
            if (!data?.presented) return false;
        }
        return true;
    }, [modules]);

    const moduleButtons = useMemo(() => {
        const buttons = [] as any[];
        for (const [_, data] of Object.entries(modules)) {
            buttons.push(
                <Button
                    size="l"
                    view={
                        data?.presented
                            ? data?.readOnly
                                ? 'outlined-warning'
                                : 'outlined-success'
                            : 'outlined'
                    }
                    selected={data?.presented}
                    pin="circle-circle"
                >
                    {data?.name}
                </Button>,
            );
        }
        return buttons;
    }, [modules]);

    const checkApiToken = async (token, isOnlyRead) => {
        try {
            const response = await ApiClient.post('auth/decode-api-token', {token});
            console.log('auth/decode-api-token', response);
            if (!response) throw new Error('Не удалось обработать токен');

            const {sid, modules: tokenModules} = response.data as any;

            if (sellerId != '' && sid != sellerId)
                throw new Error('Использован токен другого магазина');

            setSellerId(sid);

            const temp = {...modules};
            const readOnly = tokenModules.includes('read-only');
            if (isOnlyRead != readOnly) throw new Error('Вы вставили токен не в его поле');
            for (const key of Object.keys(temp)) {
                if (tokenModules.includes(key)) {
                    temp[key].presented = true;
                    temp[key].readOnly = readOnly;
                }
            }
            console.log(temp, tokenModules);

            setModules(temp);
        } catch (error) {
            console.error(error);
            showError(
                error?.response?.data?.error || error?.message || 'Не удалось обработать токен',
            );
        }
    };

    const handleOpen = async () => {
        setModules({
            content: {name: 'Контент', presented: false, readOnly: false},
            analytics: {name: 'Аналитика', presented: false, readOnly: false},
            prices_and_discounts: {name: 'Цены и скидки', presented: false, readOnly: false},
            marketplace: {name: 'Маркетплейс', presented: false, readOnly: false},
            statistics: {name: 'Статистика', presented: false, readOnly: false},
            promotion: {name: 'Продвижение', presented: false, readOnly: false},
            questions_and_feedbacks: {name: 'Вопросы и отзывы', presented: false, readOnly: false},
        });
        setOpen(true);
        setName('');
        setKey('');
        setReadKey('');
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
                        style={{
                            overflow: 'hidden',
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                        }}
                    >
                        <div
                            style={{
                                maxWidth: 350,
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                columnGap: 8,
                                rowGap: 8,
                            }}
                        >
                            {moduleButtons}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                rowGap: 8,
                                marginTop: 8,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    columnGap: 4,
                                }}
                            >
                                <Button size="s" pin="circle-circle" view="flat-success" selected>
                                    Зеленый
                                </Button>
                                - Раздел доступен на чтение и запись
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    columnGap: 4,
                                }}
                            >
                                <Button size="s" pin="circle-circle" view="flat-warning" selected>
                                    Желтый
                                </Button>
                                - Раздел доступен только на чтение
                            </div>
                        </div>
                        <Text
                            variant="body-1"
                            color="secondary"
                            style={{
                                width: 300,
                                margin: '8px',
                                marginBottom: 30,
                                textWrap: 'wrap',
                            }}
                        >
                            API токен(-ы), вместе, должны включать все следующие разделы. Вы можете
                            добавить часть из них только на чтение, но тогда будет доступен не весь
                            функционал.
                        </Text>
                        <motion.div
                            animate={{height: open ? 300 : 0}}
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
                            <div style={{minHeight: 8}} />
                            <TextTitleWrapper title={'Токен на чтение и запись'} padding={8}>
                                <PasteTextField
                                    onPaste={(value) => {
                                        checkApiToken(value, false);
                                        setKey(value);
                                    }}
                                />
                            </TextTitleWrapper>
                            <div style={{minHeight: 8}} />
                            <TextTitleWrapper
                                title={'Токен только на чтение (не обязательно)'}
                                padding={8}
                            >
                                <PasteTextField
                                    onPaste={(value) => {
                                        checkApiToken(value, true);
                                        setReadKey(value);
                                    }}
                                />
                            </TextTitleWrapper>
                            <div style={{minHeight: 8}} />
                            <Button
                                width="max"
                                size="l"
                                view="outlined-success"
                                selected
                                disabled={name === '' || key === '' || !modulesValid}
                                onClick={async () => {
                                    const params = {
                                        user_id: user?._id,
                                        campaignName: name,
                                        apiKey: key,
                                        apiReadKey: readKey,
                                        modules: modules,
                                    };
                                    try {
                                        await ApiClient.post('auth/create-campaign', params);
                                        refetchUser();
                                    } catch (error) {
                                        showError(
                                            error.response?.data?.error ||
                                                'An unknown error occurred',
                                        );
                                    }
                                    handleClose();
                                }}
                            >
                                <Text variant="subheader-1">Добавить магазин</Text>
                            </Button>
                            <Text style={{margin: '0 16px'}} variant="caption-2" color="secondary">
                                Вы можете начать работать уже через 30 минут, а через 3 - 4 часа вам
                                будет доступна подробная статистика за последние 90 дней!
                            </Text>
                            <Link
                                href="https://seller.wildberries.ru/supplier-settings/access-to-api"
                                target="_blank"
                            >
                                Сгенерируйте API токен здесь
                            </Link>
                        </motion.div>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
