// app/[module]/page.tsx
'use client';

import {useModules} from '@/contexts/ModuleProvider';
import {useCampaign} from '@/contexts/CampaignContext';

// import { DeliveryPage } from '@/components/DeliveryPage';
import {useEffect, useMemo} from 'react';
// import {useRouter} from 'next/navigation';
import dynamic from 'next/dynamic';
import {useUser} from '@/components/RequireAuth';
import {NoSubscriptionPage} from '@/components/Pages/NoSubscriptionPage';
import {LogoLoad} from '@/components/logoLoad';
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
    // analytics: dynamic(() => import('@/components/AnalyticsPage')),
    // ... other modules
};

export default function ModulePage() {
    const {userInfo, isAuthenticated} = useUser();
    const {modulesLoaded, currentModule} = useModules();
    const {sellerId, campaignInfo: campaign, campaigns} = useCampaign();
    console.log('sellerId', sellerId);
    const currentTime = new Date();
    useEffect(() => {
        const isMac = navigator.userAgent.toLowerCase().includes('mac');

        if (isMac) {
            document.documentElement.classList.add('macos');
        } else {
            document.documentElement.classList.remove('macos');
        }
    }, []);

    if (!campaigns.length && isAuthenticated) {
        const ApiPage = modulesMap['api'];

        return (
            <div>
                <ApiPage />
            </div>
        );
    }

    const subscriptionUntil = useMemo(() => {
        return campaign?.subscriptionUntil;
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
        ![1122958293, 933839157].includes(userInfo?.user?._id) &&
        !['noModules', 'api'].includes(currentModule)
    ) {
        return <NoSubscriptionPage />;
    }
    if (modulesMap[currentModule]) {
        console.log(modulesMap, module);

        const ModuleComponent = modulesMap[currentModule];

        return (
            <div>
                <ModuleComponent />
            </div>
        );
    }
    return <div>{currentModule}</div>;
}
