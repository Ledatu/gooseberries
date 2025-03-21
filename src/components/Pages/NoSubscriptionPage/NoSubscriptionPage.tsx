'use client';

import {Link, Text} from '@gravity-ui/uikit';
import {useEffect} from 'react';
import {useCampaign} from '@/contexts/CampaignContext';
import {LogoLoad} from '@/components/logoLoad';

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
            <div
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LogoLoad />
            </div>

            <div style={{width: '50vw'}}>
                <Text variant="display-1">
                    Спасибо, что используете AURUMSKYNET! Для продолжения работы с сервисом, вам
                    необходимо оплатить подписку на месяц.
                </Text>
                <br />
                <br />
                <Text variant="header-2">
                    Узнать свой тариф вы можете в разделе магазины, по поводу оплаты обращайтесь в
                    <Link href="https://t.me/AurumSkyNetSupportBot" target="_blank">
                        {' '}
                        бота поддержки.
                    </Link>
                </Text>
                <br />
                <br />
                <Text variant="header-2" color="secondary">
                    В скором времени появтся оплата на сайте. ⏳
                </Text>
            </div>
        </div>
    );
};
