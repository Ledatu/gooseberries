'use client';

// import dynamic from 'next/dynamic';
import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {Loader, Text} from '@gravity-ui/uikit';
import {useEffect} from 'react';
// import {SettingsPage} from './SettingsPage';
import {ActiveClustersTab} from '../ui/ActiveClustersTab';
import {InactiveClusters} from '../ui/InactiveClustersTab';
import {AutoPhrasesTab} from '../ui/AutoPhrasesTab/AutoPhrasesTab';
import {FixedPhrasesTab} from '../ui/FixedPhrasesTab';
import { ChangeTemplateTab } from '../ui/ChangeTemplateTab';
import { RulesTab } from '../ui/RulesTab/RulesTab';
// import {motion} from 'framer-motion';

const pagesMap = {
    // massAdvert: dynamic(() => import('@/components/MassAdvertPage')),
    ActiveClusters: ActiveClustersTab,
    InActiveClusters: InactiveClusters,
    Settings: RulesTab,
    AutoPhrases: AutoPhrasesTab,
    FixedPhrases: FixedPhrasesTab,
    ChangeTemplate: ChangeTemplateTab
};

export const AdvertsWordsPage = () => {
    const {loading, currentModule} = useAdvertsWordsModal();
    if (loading) {
        return <Loader size="l" />;
    }
    const CurrentPage: any = pagesMap[currentModule];
    useEffect(() => {
        console.log('currentPage', CurrentPage, currentModule);
    }, [currentModule]);

    if (!CurrentPage) {
        return <Text>Error</Text>;
    }
    return (
        // <div>
        <CurrentPage />
    );
};
