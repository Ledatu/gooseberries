'use client';
import {redirect} from 'next/navigation';
import {useSearchParams} from 'next/navigation';
import {useCampaign} from '@/contexts/CampaignContext';
import {useUser} from '@/components/RequireAuth';
import {setReferral} from '@/shared/Referral/api';

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const {modules} = useCampaign();
    const {isAuthenticated, userInfo} = useUser();
    const currentModule = searchParams.get('module');
    const referal = searchParams.get('referral');
    console.log('qadkaokdaskdoask', referal);
    if (referal && isAuthenticated) {
        console.log('qadkaokdaskdoask', referal);
        setReferral(userInfo.user._id, referal);
    }

    // Redirect to first available module if none selected
    if (!currentModule && modules.length > 0) {
        const firstModule = modules.includes('all') ? 'massAdvert' : modules[0];
        redirect(`/${firstModule}?${searchParams.toString()}`);
    }

    return null;
}
