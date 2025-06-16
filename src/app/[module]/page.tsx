// app/[module]/page.tsx
'use client';

import {useModules} from '@/contexts/ModuleProvider';
import {useCampaign} from '@/contexts/CampaignContext';

// import { DeliveryPage } from '@/components/DeliveryPage';
import {useMemo} from 'react';
// import {useRouter} from 'next/navigation';
import dynamic from 'next/dynamic';
import {useUser} from '@/components/RequireAuth';
import {NoSubscriptionPage} from '@/components/Pages/NoSubscriptionPage';
import {LogoLoad} from '@/components/logoLoad';
import {useSearchParams} from 'next/navigation';
import {setReferral} from '@/shared/Referral/api';
import {ApiExpiredPage} from '@/components/Pages/ApiExpiredPage';
// import {LogoLoader} from '@/components/LogoLoader';

const modulesMap: any = {
    // massAdvert: dynamic(() => import('@/components/MassAdvertPage')),
    nomenclatures: dynamic(() =>
        import('@/components/Pages/NomenclaturesPage').then((mod) => mod.NomenclaturesPage),
    ),
    prices: dynamic(() => import('@/components/Pages/PricesPage').then((mod) => mod.PricesPage), {
        ssr: false,
    }),
    delivery: dynamic(
        () => import('@/components/Pages/DeliveryPage').then((mod) => mod.DeliveryPage),
        {
            ssr: false,
        },
    ),
    reports: dynamic(
        () =>
            import('@/components/Pages/DetailedReportsPage').then((mod) => mod.DetailedReportsPage),
        {
            ssr: false,
        },
    ),
    seo: dynamic(() => import('@/components/Pages/SEOPage').then((mod) => mod.SEOPage), {
        ssr: false,
    }),
    buyers: dynamic(() => import('@/components/Pages/BuyersPage').then((mod) => mod.BuyersPage), {
        ssr: false,
    }),
    api: dynamic(() => import('@/components/Pages/ApiPage').then((mod) => mod.ApiPage), {
        ssr: false,
    }),
    analytics: dynamic(
        () => import('@/components/Pages/AnalyticsPage').then((mod) => mod.AnalyticsPage),
        {
            ssr: false,
        },
    ),
    massAdvert: dynamic(
        () => import('@/components/Pages/MassAdvertPage').then((mod) => mod.MassAdvertPage),
        {
            ssr: false,
        },
    ),
    partnerka: dynamic(
        () => import('@/components/Pages/Partnerka').then((mod) => mod.PartnerkaPage),
        {
            ssr: false,
        },
    ),
    // analytics: dynamic(() => import('@/components/AnalyticsPage')),
    // ... other modules
};

export default function ModulePage() {
    const {userInfo, isAuthenticated} = useUser();
    const {modulesLoaded, currentModule} = useModules();
    const {sellerId, campaignInfo: campaign} = useCampaign();
    console.log('sellerId', sellerId);
    const currentTime = new Date();

    const searchParams = useSearchParams();
    const referal = searchParams.get('ref');

    if (referal && isAuthenticated) {
        if (
            userInfo?.user?.hrefToReferal != referal ||
            new Date(Date.now() - 60 * 60 * 1000) > new Date(userInfo?.user?.timeOfHref)
        ) {
            console.log(new Date(), 'setting referal', referal, userInfo?.user);
            setReferral(referal);
        }
    }

    const subscriptionUntil = useMemo(() => {
        return campaign?.subscriptionUntil;
    }, [campaign]);

    const apiKeyExpDate = useMemo(() => {
        return campaign?.apiKeyExpDate;
    }, [campaign]);

    if (!modulesLoaded || !currentModule) {
        return (
            // <div>
            <LogoLoad />
            // </div>
        );
    }

    // if (!availableModules.includes(currentModule)) {
    //     return null;
    // }
    if (
        currentTime >= new Date(subscriptionUntil) &&
        ![1122958293, 933839157, 1466479176].includes(userInfo?.user?._id) &&
        !['noModules', 'api', 'partnerka'].includes(currentModule)
    ) {
        return <NoSubscriptionPage />;
    }
    if (
        currentTime >= new Date(apiKeyExpDate) &&
        !['noModules', 'api', 'partnerka'].includes(currentModule)
    ) {
        return <ApiExpiredPage />;
    }

    if (modulesMap[currentModule]) {
        console.log('modulesMap', modulesMap, 'module', module);

        const ModuleComponent = modulesMap[currentModule];

        return <ModuleComponent />;
    }
    return <div>{currentModule}</div>;
}
