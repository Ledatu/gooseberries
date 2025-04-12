'use client';

import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {Text} from '@gravity-ui/uikit';
import {useEffect} from 'react';
import {ActiveClustersTab} from '../ui/ActiveClustersTab';
import {InactiveClusters} from '../ui/InactiveClustersTab';
import {AutoPhrasesTab} from '../ui/AutoPhrasesTab/AutoPhrasesTab';
import {FixedPhrasesTab} from '../ui/FixedPhrasesTab';
import {ChangeTemplateTab} from '../ui/ChangeTemplateTab';
import {RulesTab} from '../ui/RulesTab/RulesTab';
import {LogoLoad} from '@/components/logoLoad';

const pagesMap = {
    ActiveClusters: ActiveClustersTab,
    InActiveClusters: InactiveClusters,
    Settings: RulesTab,
    AutoPhrases: AutoPhrasesTab,
    FixedPhrases: FixedPhrasesTab,
    ChangeTemplate: ChangeTemplateTab,
};

export const AdvertsWordsPage = () => {
    const {loading, currentModule} = useAdvertsWordsModal();
    if (loading) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <LogoLoad />
            </div>
        );
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
