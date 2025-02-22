import {createContext, useContext, useEffect, useState} from 'react';
import {AdvertWordsTabModules} from './types';

interface AutoWordsContextType {
    nmId: number | null;
    setNmId: (id: number) => void;
    data: any;
    loading: boolean;
    currentModule: AdvertWordsTabModules;
    setCurrentModule: (module: AdvertWordsTabModules) => void;
}
export const AutoWordsContext = createContext<AutoWordsContextType | undefined>(undefined);

export const useAdvertsWordsModal = () => {
    if (!AutoWordsContext) throw Error('No info in AutoWordsContext');
    return useContext(AutoWordsContext) as AutoWordsContextType;
};

export const AutoWordsProvider = ({children}: {children: React.ReactNode}) => {
    const [nmId, setNmId] = useState<number | null>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentModule, setCurrentModule] = useState<AdvertWordsTabModules>('ActiveClusters');

    // Fetch data when nmId changes
    useEffect(() => {
        if (nmId !== null) {
            setLoading(true);
            setData('al;dks;kd;lak');
            //   fetch(`/backend/getAutoWords?nmId=${nmId}`)
            //     .then((res) => res.json())
            //     .then((result) => {
            //       setData(result);
            //       setLoading(false);
            //     })
            //     .catch(() => setLoading(false));
            setLoading(false);
        }
    }, [nmId]); // Fetch only when nmId changes

    return (
        <AutoWordsContext.Provider
            value={{
                nmId,
                setNmId,
                data,
                loading,
                currentModule,
                setCurrentModule,
            }}
        >
            {children}
        </AutoWordsContext.Provider>
    );
};
