'use client';
import {redirect} from 'next/navigation';
import {useSearchParams} from 'next/navigation';
import {useCampaign} from '@/contexts/CampaignContext';

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const {modules} = useCampaign();
    const currentModule = searchParams.get('module');

    // Redirect to first available module if none selected
    if (!currentModule && modules.length > 0) {
        const firstModule = modules.includes('all') ? 'massAdvert' : modules[0];
        redirect(`/${firstModule}?${searchParams.toString()}`);
    }

    return null;
}
