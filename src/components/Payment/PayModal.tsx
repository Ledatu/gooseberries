import {ModalWindow} from '@/shared/ui/Modal';
import {QrCode, Receipt} from '@gravity-ui/icons';
import {Button, Card, Icon, Loader, Spin, Text, TextInput} from '@gravity-ui/uikit';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {motion} from 'framer-motion';
import {useUser} from '../RequireAuth';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {defaultRender} from '@/utilities/getRoundValue';

interface PayModalInterface {
    children: any;
    sellerId: string;
    name: string;
    setUpdate?: Function;
}

export const PayModal = ({children, sellerId, name, setUpdate}: PayModalInterface) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const {showError} = useError();
    const {userInfo, refetchUser} = useUser();
    const {user} = userInfo;

    const [open, setOpen] = useState(false);
    const [isQrPay, setIsQrPay] = useState(false);

    const [qr, setQr] = useState({} as any);
    const [qrGenerating, setQrGenerating] = useState(false);

    const [email, setEmail] = useState(user?.email ?? '');
    useEffect(() => setEmail(user?.email ?? email), [user]);
    const emailValid = useMemo(() => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
    }, [email]);

    const [qrSrc, setQrSrc] = useState('');

    useEffect(() => {
        if (!qr?.qrcId) return;
        getBase64Img();
        if (!qr?.payload || !isMobile) return;
        window.location.href = qr?.payload;
    }, [qr]);

    const [checkingSubscription, setCheckingSubscription] = useState(false);

    const [tariff, setTariff] = useState({} as any);

    const getSubscriptionTariff = async () => {
        try {
            const response = await ApiClient.post('campaigns/get-subscription-tarif', {
                seller_id: sellerId,
            });
            if (!response || !response?.data) return;

            setTariff(response?.data);
        } catch (error: any) {
            console.error(new Date(), 'error', error);
            showError(error?.response?.data?.error || 'Возникла ошибка');
        }
    };

    useEffect(() => {
        if (!sellerId) return;
        getSubscriptionTariff();
    }, [sellerId, qr]);

    const checkSubscription = async () => {
        try {
            if (!checkingSubscription) setCheckingSubscription(true);
            const response = await ApiClient.post('campaigns/get-qr-subscription', {
                qrcId: qr?.qrcId,
            });
            if (!response || !response?.data) return;

            refetchUser();
            handleClose();
            if (setUpdate) setUpdate(true);
        } catch (error: any) {
            console.error(new Date(), 'error', error);
            showError(error?.response?.data?.error || 'Возникла ошибка');
        }
    };

    useEffect(() => {
        if (qr?.qrcId !== undefined) {
            const interval = setInterval(() => {
                checkSubscription();
            }, 20 * 1000);

            return () => clearInterval(interval);
        }

        return undefined;
    }, [qr]);

    const getBase64Img = async () => {
        try {
            const response = await ApiClient.post('campaigns/get-qr-img', {
                qrcId: qr?.qrcId,
            });
            if (!response || !response?.data) throw new Error('No QR!');
            setQrSrc('data:image/png;base64,' + (response?.data ?? ''));
        } catch (error: any) {
            console.error(new Date(), 'error', error);
            showError(error?.response?.data?.error || 'Возникла ошибка');
        }
    };

    const handleOpen = () => {
        setOpen(true);
        setIsQrPay(false);
        setQrGenerating(false);
    };
    const handleClose = () => setOpen(false);

    const handleQrPay = async () => {
        try {
            if (qrGenerating) return;
            if (user?.email != email) {
                await ApiClient.post('auth/set-email', {email});
                refetchUser();
            }
            setQrGenerating(true);
            const response = await ApiClient.post('campaigns/get-dynamic-qr', {
                seller_id: sellerId,
                email,
            });
            if (!response || !response?.data) throw new Error('No QR!');
            setQr(response?.data);
        } catch (error: any) {
            console.error(new Date(), 'error', error);
            showError(error?.response?.data?.error || 'Возникла ошибка');
            setQrGenerating(false);
        }
    };

    const childArray = Children.toArray(children);

    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('PayModal: No valid React element found in children.', sellerId);
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 12,
                    }}
                >
                    <Text variant="header-1">Подписка на сервис AURUMSKYNET.</Text>
                    <Text>Подписка для магазина {name}</Text>
                    {tariff?.initial !== undefined ? (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }}
                        >
                            <Text>К оплате:</Text>
                            <Text>{defaultRender({value: tariff?.toPay})} ₽</Text>
                            {tariff?.toPay != tariff?.initial ? (
                                <Text color="secondary" style={{textDecoration: 'line-through'}}>
                                    {defaultRender({value: tariff?.initial})} ₽
                                </Text>
                            ) : (
                                <></>
                            )}
                        </motion.div>
                    ) : (
                        <></>
                    )}
                    <motion.div
                        animate={{
                            maxHeight: qrGenerating ? 500 : 0,
                            height: qrGenerating ? 'calc(100vw - 70px)' : 0,
                            opacity: qrGenerating ? 1 : 0,
                        }}
                        style={{
                            overflow: isQrPay ? undefined : 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            width: 'calc(100vw - 70px)',
                            maxWidth: 500,
                            justifyContent: 'center',
                            maxHeight: 0,
                            opacity: 0,
                        }}
                    >
                        <Card
                            style={{
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            {qr?.qrcId && qrSrc.length ? <img src={qrSrc} /> : <Loader size="l" />}
                        </Card>
                    </motion.div>
                    <motion.div
                        animate={{
                            maxHeight: isQrPay ? 160 : 0,
                            opacity: isQrPay ? 1 : 0,
                        }}
                        style={{
                            overflow: isQrPay ? undefined : 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            width: 'calc(100vw - 70px)',
                            maxWidth: 500,
                            justifyContent: 'center',
                            gap: 12,
                            maxHeight: 0,
                            opacity: 0,
                        }}
                    >
                        <TextInput
                            autoComplete
                            name="email"
                            size="xl"
                            value={email}
                            onUpdate={(val) => setEmail(val)}
                            type="email"
                            placeholder="Email для чека"
                            validationState={emailValid ? undefined : 'invalid'}
                        />

                        <motion.div exit={{opacity: 0}}>
                            <Button
                                disabled={!emailValid}
                                width="max"
                                size="xl"
                                pin="circle-circle"
                                view="outlined-action"
                                onClick={handleQrPay}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 8,
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    {checkingSubscription && qrGenerating
                                        ? 'Ожидаем оплату'
                                        : 'Оплатить'}
                                    {checkingSubscription && qrGenerating ? (
                                        <Spin size="xs" />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </Button>
                        </motion.div>
                        <Button
                            width="max"
                            size="xl"
                            pin="circle-circle"
                            view="flat"
                            onClick={() => {
                                setIsQrPay(false);
                                setQrGenerating(false);
                            }}
                        >
                            Отмена
                        </Button>
                    </motion.div>
                    <motion.div
                        animate={{maxHeight: isQrPay ? 0 : 100}}
                        style={{
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 12,
                            maxHeight: 100,
                        }}
                    >
                        <Button
                            size="xl"
                            width="max"
                            pin="circle-circle"
                            view="outlined-action"
                            onClick={() => setIsQrPay(true)}
                        >
                            <Icon data={QrCode} />
                            Оплатить по QR
                        </Button>
                        <Button
                            size="xl"
                            width="max"
                            pin="circle-circle"
                            view="flat"
                            href={'https://t.me/AurumSkyNetSupportBot'}
                            target={'_blank'}
                        >
                            <Icon data={Receipt} />
                            Запросить счет
                        </Button>
                    </motion.div>
                </div>
            </ModalWindow>
        </>
    );
};
