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
    const {modules = [], campaignInfo = {}, campaignLoaded, selectValue} = useCampaign(); // Add default value
    const {userInfo} = useUser();
    const {user} = userInfo ?? {};
    // const {modulesMap = {}} = campaignInfo?.modules || {};
    const modulesMap = useMemo(() => {
        return campaignInfo?.modules || {};
    }, [campaignInfo]);

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
    };

    useEffect(() => {
        if (!modules || !campaignLoaded) return;
        // Ensure modules is always an array
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
        if (![1122958293, 566810027, 933839157].includes(user?.['_id'])) {
            baseModules = baseModules.filter((item) => item != 'reports');
        }
        console.log(baseModules);
        setAvailableModules([...baseModules, 'api']);
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
        setAvailableModulesMap(baseModulesMap);
        setModulesLoaded(true);
    }, [modules, campaignLoaded]);

    useEffect(() => {
        console.log(campaignLoaded);
        if (!campaignLoaded) return;
        if (currentModule == null) {
            const pathModule = pathname.split('/').pop() || '';
            if (availableModules.includes(pathModule)) {
                setCurrentModule(pathModule);
            } else if (availableModules.length > 0) {
                const defaultModule = availableModules.includes('massAdvert')
                    ? 'massAdvert'
                    : availableModules[0];
                setCurrentModule(defaultModule);
            }
            // router.replace(`/${module}?${searchParams.toString()}`);
        }
        // const pathModule = pathname.split('/').pop() || '';

        // console.log(availableModules, 'availableModules');

        // if (availableModules.includes(pathModule)) {
        //     setCurrentModule(pathModule);
        // } else if (availableModules.length > 0) {
        //     const defaultModule = availableModules.includes('massAdvert')
        //         ? 'massAdvert'
        //         : availableModules[0];
        //     router.push(`/${defaultModule}?${searchParams.toString()}`);
        // }
    }, [availableModules, campaignLoaded]);

    useEffect(() => {
        const basePath = pathname.split('/').slice(0, 1);
        console.log('basePath', basePath);
        if (!currentModule) return;
        router.replace(`${basePath}/${currentModule}?${searchParams.toString()}`);
        document.title = `${moduleTitles[currentModule]} | ${selectValue[0]}`;
    }, [currentModule, searchParams]);

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
