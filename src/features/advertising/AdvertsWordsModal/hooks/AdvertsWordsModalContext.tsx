import {createContext, useContext, useEffect, useState} from 'react';
import {AdvertKeywordStat, AdvertWordsTabModules} from '../types';
import ApiClient from '@/utilities/ApiClient';
import {useCampaign} from '@/contexts/CampaignContext';
import {fetchClusterStats} from '../api/fetchClusterStats';
import { ClusterData } from '../api/mapper';

interface AutoWordsContextType {
    advertId: number | null;
    loading: boolean;
    currentModule: AdvertWordsTabModules;
    setCurrentModule: (module: AdvertWordsTabModules) => void;
    stats: ClusterData[];
}
export const AutoWordsContext = createContext<AutoWordsContextType | undefined>(undefined);

export const useAdvertsWordsModal = () => {
    if (!AutoWordsContext) throw Error('No info in AutoWordsContext');
    return useContext(AutoWordsContext) as AutoWordsContextType;
};
interface AdvertsWordsProviderProps {
    children: React.ReactNode;
    advertId: number;
}

export const AdvertWordsProvider = ({children, advertId}: AdvertsWordsProviderProps) => {
    const [stats, setStats] = useState<ClusterData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentModule, setCurrentModule] = useState<AdvertWordsTabModules>('ActiveClusters');
    const [startAdvert, setStartAdvert] = useState<Date>(new Date());
    const [endAdvert, setEndAdvert] = useState<Date>(new Date());
    const {sellerId} = useCampaign();

    const fetchStats = async () => {
        try {
            setLoading(true)
            const {clusterData, endTime, startTime} = await fetchClusterStats(advertId, sellerId);
            setStartAdvert(startTime);
            setEndAdvert(endTime);
            setStats(clusterData);
            setLoading(false);

        } catch (error) {
            console.error('Error while fetching cluster stats', error);
        }
    };

    // Fetch data when advertId changes
    useEffect(() => {
        if (advertId !== null) {
            fetchStats();
        }
    }, [advertId]); // Fetch only when advertId changes

    return (
        <AutoWordsContext.Provider
            value={{
                advertId,
                stats,
                loading,
                currentModule,
                setCurrentModule,
            }}
        >
            {children}
        </AutoWordsContext.Provider>
    );
};
