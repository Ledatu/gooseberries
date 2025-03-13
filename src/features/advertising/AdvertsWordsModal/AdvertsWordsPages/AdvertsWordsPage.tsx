'use client';

// import dynamic from 'next/dynamic';
import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {Loader, Text} from '@gravity-ui/uikit';
import {useEffect} from 'react';
import {ActiveClustersPage} from './ActiveClustersModule/ActiveClustersPage';
import {InactiveClustersPage} from './InactiveClustersPage';
import {SettingsPage} from './SettingsPage';
import {AutoPhrasesPage} from './AutoPhrasesPage';
// import {motion} from 'framer-motion';

const pagesMap = {
    // massAdvert: dynamic(() => import('@/components/MassAdvertPage')),
    ActiveClusters: ActiveClustersPage,
    InActiveClusters: InactiveClustersPage,
    Settings: SettingsPage,
    AutoPhrases: AutoPhrasesPage,
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
