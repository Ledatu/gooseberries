// app/[module]/page.tsx
'use client';

import {useModules} from '@/contexts/ModuleProvider';
import {useCampaign} from '@/contexts/CampaignContext';

// import { DeliveryPage } from '@/components/DeliveryPage';
import {useEffect, useMemo, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
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
    const router = useRouter();
    const params = useParams();
    const {userInfo} = useUser();
    const {availableModules, modulesLoaded} = useModules();
    const {sellerId, campaign} = useCampaign();
    const [module, setModule] = useState<string | null>(null);
    const currentTime = new Date();
    useEffect(() => {
        if (params?.module) {
            setModule(Array.isArray(params.module) ? params.module[0] : params.module);
        }
    }, [params]);

    // Handle initial module validation
    useEffect(() => {
        if (modulesLoaded && module && !availableModules.includes(module)) {
            router.replace(`/api?seller_id=${sellerId}`);
        }
    }, [modulesLoaded, module, availableModules, router, sellerId]);

    const subscriptionUntil = useMemo(() => {
        console.log(campaign);
        return campaign?.subscriptionUntil;
    }, [campaign]);

    if (!modulesLoaded || !module) {
        return (
            // <div>
            <LogoLoad />
            // </div>
        );
    }

    if (!availableModules.includes(module)) {
        return null;
    }
    if (
        currentTime >= new Date(subscriptionUntil) &&
        ![1122958293, 933839157].includes(userInfo?.user?._id) &&
        !['noModules', 'api'].includes(module)
    ) {
        return <NoSubscriptionPage />;
    }

    if (modulesMap[module]) {
        console.log(module);
        const ModuleComponent = modulesMap[module];

        return (
            <div>
                <ModuleComponent />
            </div>
        );
    }
    return <div>{module}</div>;
}
