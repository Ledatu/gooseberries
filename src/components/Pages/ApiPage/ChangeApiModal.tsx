'use client';

import {Button, Card, Modal, Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {Children, isValidElement, ReactElement, useState, cloneElement, useMemo} from 'react';
import {useUser} from '@/components/RequireAuth/RequireAuth';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {TextTitleWrapper} from '@/components/TextTitleWrapper';
import {PasteTextField} from './PasteTextField';
import Link from 'next/link';

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
    const [readKey, setReadKey] = useState('');

    const [modules, setModules] = useState({
        content: {name: 'Контент', presented: false, readOnly: false, required: true},
        analytics: {name: 'Аналитика', presented: false, readOnly: false, required: true},
        prices_and_discounts: {
            name: 'Цены и скидки',
            presented: false,
            readOnly: false,
            required: false,
        },
        marketplace: {name: 'Маркетплейс', presented: false, readOnly: false, required: false},
        statistics: {name: 'Статистика', presented: false, readOnly: false, required: true},
        promotion: {name: 'Продвижение', presented: false, readOnly: false, required: true},
        questions_and_feedbacks: {
            name: 'Вопросы и отзывы',
            presented: false,
            readOnly: false,
            required: false,
        },
    });

    const modulesValid = useMemo(() => {
        for (const [_, data] of Object.entries(modules)) {
            if (!data?.presented && data?.required) return false;
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
                    {data?.required ? (
                        <Text color="danger" variant="subheader-2" style={{marginLeft: 3}}>
                            *
                        </Text>
                    ) : (
                        <></>
                    )}
                </Button>,
            );
        }
        return buttons;
    }, [modules]);

    const checkApiToken = async (token: string, isOnlyRead: boolean) => {
        try {
            const response = await ApiClient.post('auth/decode-api-token', {token});
            console.log('auth/decode-api-token', response);
            if (!response) throw new Error('Не удалось обработать токен');

            const {sid, modules: tokenModules} = response.data as any;

            console.log('sid', sid, sellerId);

            if (sellerId != '' && sid != sellerId)
                throw new Error('Использован токен другого магазина');

            const temp: any = {...modules};
            const readOnly = tokenModules.includes('read-only');
            if (isOnlyRead != readOnly) throw new Error('Вы вставили токен не в его поле');
            for (const key of Object.keys(temp)) {
                if (tokenModules.includes(key) && (readOnly ? !temp[key].presented : true)) {
                    temp[key].presented = true;
                    temp[key].readOnly = readOnly;
                }
            }
            console.log(temp, tokenModules);

            setModules(temp);
        } catch (error: any) {
            console.error(error);
            showError(
                error?.response?.data?.error || error?.message || 'Не удалось обработать токен',
            );
        }
    };

    const handleOpen = async () => {
        setModules({
            content: {name: 'Контент', presented: false, readOnly: false, required: true},
            analytics: {name: 'Аналитика', presented: false, readOnly: false, required: true},
            prices_and_discounts: {
                name: 'Цены и скидки',
                presented: false,
                readOnly: false,
                required: false,
            },
            marketplace: {name: 'Маркетплейс', presented: false, readOnly: false, required: false},
            statistics: {name: 'Статистика', presented: false, readOnly: false, required: true},
            promotion: {name: 'Продвижение', presented: false, readOnly: false, required: true},
            questions_and_feedbacks: {
                name: 'Вопросы и отзывы',
                presented: false,
                readOnly: false,
                required: false,
            },
        });
        setOpen(true);
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

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const editApiCall = async () => {
        const params = {
            seller_id: sellerId,
            user_id: user?._id,
            apiKey: key,
            apiReadKey: readKey,
            modules: modules,
        };
        try {
            await ApiClient.post('auth/update-campaign-api', params);
            refetchUser();
        } catch (error: any) {
            showError(error.response?.data?.error || 'An unknown error occurred');
        }
        handleClose();
    };

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
                            backdropFilter: 'blur(48px)',
                            WebkitBackdropFilter: 'blur(48px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            gap: 8,
                            border: '1px solid #eee2',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: 8,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: 350,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        gap: 8,
                                    }}
                                >
                                    {moduleButtons}
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 8,
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
                                        <Button
                                            size="s"
                                            pin="circle-circle"
                                            view="flat-success"
                                            selected
                                        >
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
                                        <Button
                                            size="s"
                                            pin="circle-circle"
                                            view="flat-warning"
                                            selected
                                        >
                                            Желтый
                                        </Button>
                                        - Раздел доступен только на чтение
                                    </div>
                                </div>
                                <Text
                                    variant="caption-2"
                                    color="secondary"
                                    style={{
                                        width: 300,
                                        textWrap: 'wrap',
                                    }}
                                >
                                    API токен(-ы), вместе, должны включать все следующие разделы. Вы
                                    можете добавить часть из них только на чтение, но тогда будет
                                    доступен не весь функционал.
                                </Text>
                            </div>
                            <div
                                style={{
                                    maxWidth: 350,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <TextTitleWrapper title={'Токен на чтение и запись'} padding={8}>
                                    <PasteTextField
                                        onPaste={(value: any) => {
                                            checkApiToken(value, false);
                                            setKey(value);
                                        }}
                                    />
                                </TextTitleWrapper>
                                <TextTitleWrapper
                                    title={'Токен только на чтение (не обязательно)'}
                                    padding={8}
                                >
                                    <PasteTextField
                                        onPaste={(value: any) => {
                                            checkApiToken(value, true);
                                            setReadKey(value);
                                        }}
                                    />
                                </TextTitleWrapper>
                                <Link
                                    href="https://seller.wildberries.ru/supplier-settings/access-to-api"
                                    target="_blank"
                                >
                                    Сгенерируйте API токен здесь
                                </Link>
                            </div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'row', gap: 8, width: '100%'}}>
                            <Button
                                size="l"
                                pin="circle-circle"
                                view="outlined-success"
                                selected
                                disabled={key === '' || !modulesValid}
                                onClick={editApiCall}
                            >
                                Обновить API
                            </Button>
                            <Button size="l" pin="circle-circle" onClick={handleClose}>
                                Отмена
                            </Button>
                        </div>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
