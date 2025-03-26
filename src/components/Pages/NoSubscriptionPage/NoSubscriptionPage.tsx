'use client';

import {Button, Icon, Text} from '@gravity-ui/uikit';
import {useEffect} from 'react';
import {useCampaign} from '@/contexts/CampaignContext';
import {LogoLoad} from '@/components/logoLoad';
import {QrCode} from '@gravity-ui/icons';
import {PayModal} from '@/components/Payment/PayModal';
import {useMediaQuery} from '@/hooks/useMediaQuery';

export const NoSubscriptionPage = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const {setSwitchingCampaignsFlag, sellerId, selectValue} = useCampaign();
    useEffect(() => {
        setSwitchingCampaignsFlag(false);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                // height: 'calc(100vh - 105px)',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LogoLoad />
            </div>

            <div
                style={{
                    width: isMobile ? '80vw' : '50vw',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text variant={isMobile ? 'header-1' : 'display-1'}>
                    Спасибо, что используете AURUMSKYNET! Для продолжения работы с сервисом, вам
                    необходимо оплатить подписку на месяц.
                </Text>
                <br />
                <br />
                <PayModal sellerId={sellerId} name={selectValue[0]}>
                    <Button pin="circle-circle" view="action" size="xl">
                        <Icon data={QrCode} />
                        Оплатить подписку
                    </Button>
                </PayModal>
                <br />
                <br />
            </div>
        </div>
    );
};
