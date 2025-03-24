// app/[module]/page.tsx
'use client';

import {useModules} from '@/contexts/ModuleProvider';
import {useCampaign} from '@/contexts/CampaignContext';

// import { DeliveryPage } from '@/components/DeliveryPage';
import {useMemo} from 'react';
// import {useRouter} from 'next/navigation';
import dynamic from 'next/dynamic';
import {useUser} from '@/components/RequireAuth';
import {NoSubscriptionPage} from '@/Pages/NoSubscriptionPage';
import {LogoLoad} from '@/components/logoLoad';
// import {LogoLoader} from '@/components/LogoLoader';

const modulesMap: any = {
    // massAdvert: dynamic(() => import('@/components/MassAdvertPage')),
    nomenclatures: dynamic(() =>
        import('@/Pages/NomenclaturesPage').then((mod) => mod.NomenclaturesPage),
    ),
    prices: dynamic(() => import('@/Pages/PricesPage').then((mod) => mod.PricesPage), {
        ssr: false,
    }),
    delivery: dynamic(() => import('@/Pages/DeliveryPage').then((mod) => mod.DeliveryPage), {
        ssr: false,
    }),
    reports: dynamic(
        () => import('@/Pages/DetailedReportsPage').then((mod) => mod.DetailedReportsPage),
        {
            ssr: false,
        },
    ),
    seo: dynamic(() => import('@/Pages/SEOPage').then((mod) => mod.SEOPage), {
        ssr: false,
    }),
    buyers: dynamic(() => import('@/Pages/BuyersPage').then((mod) => mod.BuyersPage), {
        ssr: false,
    }),
    api: dynamic(() => import('@/Pages/ApiPage').then((mod) => mod.ApiPage), {
        ssr: false,
    }),
    analytics: dynamic(() => import('@/Pages/AnalyticsPage').then((mod) => mod.AnalyticsPage), {
        ssr: false,
    }),
    massAdvert: dynamic(() => import('@/Pages/MassAdvertPage').then((mod) => mod.MassAdvertPage), {
        ssr: false,
    }),
    // analytics: dynamic(() => import('@/components/AnalyticsPage')),
    // ... other modules
};

export default function ModulePage() {
    const {userInfo, isAuthenticated} = useUser();
    const {modulesLoaded, currentModule} = useModules();
    const {sellerId, campaignInfo: campaign, campaigns} = useCampaign();
    console.log('sellerId', sellerId);
    const currentTime = new Date();

    // // Handle initial currentModule validation
    // useEffect(() => {
    //     console.log(currentModule);
    //     if (modulesLoaded && currentModule && isAuthenticated) {
    //         if (!availableModules.includes(cur)) {
    //             router.replace(`/api${campaigns.length ? `?seller_id=${sellerId}` : ''}`);
    //         } else {
    //             router.replace(`/${module}${campaigns.length ? `?seller_id=${sellerId}` : ''}`);
    //         }
    //     }
    //     if (modulesLoaded && module && !availableModules.includes(module) && isAuthenticated) {
    //         console.log(':LADK:LAKD:LDKJ;l');
    //         router.replace(`/api${campaigns.length ? `?seller_id=${sellerId}` : ''}`);
    //     }
    // }, [modulesLoaded, module, availableModules, sellerId, isAuthenticated]);
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
