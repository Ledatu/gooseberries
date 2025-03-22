'use client';

import {
    Button,
    ButtonPin,
    Card,
    Icon,
    List,
    Loader,
    Popup,
    Text,
    Tooltip,
    ButtonView,
} from '@gravity-ui/uikit';
import {ArrowRight, TagRuble, Xmark} from '@gravity-ui/icons';
import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';

interface CanBeAddedToSalesProps {
    nmId: number;
    sellerId: string;
    pin: ButtonPin;
    view: ButtonView;
    selected: boolean;
    setAutoSalesModalOpenFromParent: (args: any) => any;
}

export const CanBeAddedToSales = ({
    nmId,
    sellerId,
    pin,
    view,
    selected,
    setAutoSalesModalOpenFromParent,
}: CanBeAddedToSalesProps) => {
    const themeVal = localStorage.getItem('theme');
    const initialTheme =
        themeVal !== 'undefined' && themeVal !== 'null' && themeVal ? themeVal : 'dark';
    const {showError} = useError();
    const [open, setOpen] = useState(false);
    const [availableSales, setAvailableSales] = useState([] as any[]);
    const [pending, setPending] = useState(false);
    const getAvailableSales = async () => {
        let availableSalesTemp = [] as any[];
        try {
            const params = {nmId: nmId, seller_id: sellerId};
            const response = await ApiClient.post('massAdvert/availableSalesForNmId', params);
            if (!response?.data) {
                throw new Error('No available sales');
            }
            if (!response || !response['data']) return;
            availableSalesTemp = response['data'];
            console.log(response.data.dzhemPhrases, nmId);
        } catch (error: any) {
            showError(error.response?.data?.error || 'Не удалось узнать доступные акции.');
            console.error(error);
        } finally {
            console.log(availableSalesTemp);

            setAvailableSales(availableSalesTemp);
            setPending(false);
        }
    };

    useEffect(() => {
        if (!open) return;
        setTimeout(() => setOpen(false), 10000);
        getAvailableSales();
    }, [open]);
    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
    return (
        <>
            <Popup open={open} anchorElement={anchorElement} hasArrow={false}>
                <div
                    style={{
                        width: 0,
                        height: 0,
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: initialTheme == 'light' ? '#fff9' : undefined,

                            backdropFilter: 'blur(48px)',
                            boxShadow: '#0006 0px 2px 8px 0px',
                            borderRadius: 30,
                            border: '1px solid #eee2',
                            width: 420,
                            left: -70,
                            height: 178,
                            overflow: 'auto',
                            position: 'absolute',
                        }}
                    >
                        <div
                            style={{
                                justifyContent: 'center',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                margin: 8,
                                position: 'relative',
                            }}
                        >
                            <Text>Можно добавить в:</Text>
                            <Button
                                onClick={() => setOpen(false)}
                                style={{position: 'absolute', right: 8}}
                                size="s"
                                pin="circle-circle"
                                view="flat"
                            >
                                <Icon data={Xmark} />
                            </Button>
                        </div>
                        <motion.div
                            style={{
                                width: '100%',
                                height: 136,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {pending ? (
                                <Loader />
                            ) : (
                                <motion.div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <List
                                        itemsHeight={136}
                                        itemHeight={52}
                                        renderItem={(item) => {
                                            return (
                                                <Tooltip content={item.name}>
                                                    <Card
                                                        theme="warning"
                                                        style={{
                                                            height: 48,
                                                            borderRadius: 24,
                                                            width: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            paddingLeft: 8,
                                                            margin: '4px 4px 4px 4px',
                                                            // marginBottom: '8px',
                                                        }}
                                                    >
                                                        <Text variant="subheader-1" ellipsis={true}>
                                                            {item.name}
                                                        </Text>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignContent: 'center',
                                                            }}
                                                        >
                                                            <Text
                                                                variant="body-1"
                                                                style={{marginInline: '8px'}}
                                                            >
                                                                {Math.round(item.price)} ₽
                                                            </Text>
                                                            <Text
                                                                color={
                                                                    Math.round(item.price) <
                                                                    Math.round(item.planPrice)
                                                                        ? 'positive'
                                                                        : Math.round(item.price) >
                                                                            Math.round(
                                                                                item.planPrice,
                                                                            )
                                                                          ? 'danger'
                                                                          : 'primary'
                                                                }
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Icon data={ArrowRight} size={18} />
                                                            </Text>
                                                            <Text
                                                                variant="body-1"
                                                                style={{marginInline: '8px'}}
                                                            >
                                                                {Math.round(item.planPrice)} ₽
                                                            </Text>
                                                        </div>
                                                    </Card>
                                                </Tooltip>
                                            );
                                        }}
                                        onItemClick={(item) => {
                                            setAutoSalesModalOpenFromParent(item?.name);
                                            setOpen(false);
                                        }}
                                        filterable={false}
                                        items={availableSales}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </Popup>
            <Button
                ref={setAnchorElement}
                size="xs"
                pin={pin as ButtonPin}
                view={view as ButtonView}
                selected={selected}
                onClick={() => setOpen(!open)}
            >
                <Icon data={TagRuble} size={12} />
            </Button>
        </>
    );
};
