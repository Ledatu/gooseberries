'use client';

import {Text} from '@gravity-ui/uikit';
import {useEffect} from 'react';
import {useCampaign} from '@/contexts/CampaignContext';
import {LogoLoad} from '@/components/logoLoad';
import {useMediaQuery} from '@/hooks/useMediaQuery';

export const ApiExpiredPage = () => {33
    const isMobile = useMediaQuery('(max-width: 768px)');
    const {setSwitchingCampaignsFlag} = useCampaign();
    useEffect(() => {
        setSwitchingCampaignsFlag(false);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
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
                    необходимо заменить API токен. Сделать это можно в разделе Магазины.
                </Text>
            </div>
        </div>
    );
};
