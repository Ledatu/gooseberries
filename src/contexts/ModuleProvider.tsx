// contexts/ModuleProvider.tsx
'use client';

import {createContext, useContext, useState, useEffect, useMemo} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {useCampaign} from '@/contexts/CampaignContext';
import {useUser} from '@/components/RequireAuth';

type ModuleContextType = {
    currentModule: string | null;
    availableModules: string[];
    setModule: (module: string) => void;
    modulesLoaded: boolean;
    availablemodulesMap: any;
};

const ModuleContext = createContext<ModuleContextType>({
    currentModule: '',
    availableModules: [],
    setModule: () => {},
    modulesLoaded: false,
    availablemodulesMap: {},
});

export const ModuleProvider = ({children}: {children: React.ReactNode}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {modules = [], campaignInfo = {}, campaigns, selectValue, campaignLoaded} = useCampaign(); // Add default value
    const {isAuthenticated} = useUser();
    // const {modulesMap = {}} = campaignInfo?.modules || {};

    const modulesMap = useMemo(() => {
        return campaignInfo?.userModules || {};
    }, [campaignInfo]);
    console.log('sss', campaignInfo, modulesMap);

    const [availableModules, setAvailableModules] = useState<string[]>([]);
    const [availableModulesMap, setAvailableModulesMap] = useState<any>({});
    const [currentModule, setCurrentModule] = useState<string | null>(null);
    const [modulesLoaded, setModulesLoaded] = useState(false);

    const moduleTitles: Record<string, string> = {
        massAdvert: 'Реклама',
        analytics: 'Аналитика',
        prices: 'Цены',
        delivery: 'Поставки',
        nomenclatures: 'Товары',
        buyers: 'Покупатели',
        reports: 'Отчеты',
        seo: 'SEO',
        api: 'Магазины',
        partnerka: 'Партнерка',
    };

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('s;d;als;dl', isAuthenticated);
            return;
        }
        const safeModules = Array.isArray(modules) ? modules : [];

        let baseModules = safeModules.includes('all')
            ? [
                  'massAdvert',
                  'analytics',
                  'prices',
                  'delivery',
                  'nomenclatures',
                  'buyers',
                  'reports',
                  'seo',
              ]
            : safeModules;
        // if (![1122958293, 566810027, 933839157].includes(user?.['_id'])) {
        //     baseModules = baseModules.filter((item) => item != 'reports');
        // }
        console.log([...baseModules, 'api', 'partnerka']);
        setAvailableModules([...baseModules, 'api', 'partnerka']);
        const baseModulesMap = safeModules.includes('all')
            ? {
                  massAdvert: 'Управление',
                  analytics: 'Управление',
                  prices: 'Управление',
                  delivery: 'Управление',
                  nomenclatures: 'Управление',
                  buyers: 'Управление',
                  reports: 'Управление',
                  seo: 'Управление',
              }
            : modulesMap;
        baseModulesMap['api'] = 'Управление';
        baseModulesMap['partnerka'] = 'Управление';
        setAvailableModulesMap(baseModulesMap);
        setModulesLoaded(true);
    }, [modules, campaigns, isAuthenticated]);

    useEffect(() => {
        // if (!modulesLoaded) return;

        if (!campaigns.length && campaignLoaded) {
            console.log('хуй хуй хуй хуй');
            setCurrentModule('api');
            return;
        }
        if (currentModule == null || 'api') {
            const pathModule = pathname.split('/').pop() || '';
            console.log('pathModule', pathModule);
            if (availableModules.includes(pathModule)) {
                setCurrentModule(pathModule);
            } else if (availableModules.length > 0) {
                const defaultModule = availableModules[0] ?? 'api';
                console.log('defaultmodule', defaultModule);
                setCurrentModule(defaultModule);
            }
        }
    }, [availableModules, campaigns, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            const basePath = pathname.split('/').slice(0, 1);
            console.log('basePath', basePath, currentModule, availableModules, availableModulesMap);
            if (!currentModule) return;
            router.replace(`${basePath}/${currentModule}?${searchParams.toString()}`);
            document.title = `${moduleTitles[currentModule]} | ${selectValue[0]}`;
        }
    }, [currentModule, searchParams, isAuthenticated]);

    // const handleSetModule = useCallback(() => {}, [router, pathname, searchParams]);

    return (
        <ModuleContext.Provider
            value={{
                currentModule,
                availableModules: availableModules || [], // Ensure array
                setModule: setCurrentModule,
                modulesLoaded: modulesLoaded,
                availablemodulesMap: availableModulesMap,
            }}
        >
            {children}
        </ModuleContext.Provider>
    );
};

export const useModules = () => useContext(ModuleContext);
