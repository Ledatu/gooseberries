'use client';

import {AccessDenied} from '@gravity-ui/illustrations';
import {Text} from '@gravity-ui/uikit';
import {useEffect} from 'react';
import {useCampaign} from '@/contexts/CampaignContext';

export const NoSubscriptionPage = () => {
    const {setSwitchingCampaignsFlag} = useCampaign();
    useEffect(() => {
        setSwitchingCampaignsFlag(false);
    });
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
            <AccessDenied />
            <Text variant="display-2" style={{width: 600}}>
                Спасибо, что пользуетесь AURUM! Для продолжения работы с сервисом, вам необходимо
                оплатить подписку на месяц.
            </Text>
        </div>
    );
};
