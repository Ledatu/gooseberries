'use client';
import {createContext, useContext, useState, useEffect, useCallback, useMemo} from 'react';
import {useError} from './ErrorContext';
import callApi, {getUid} from '../utilities/callApi';
import {useRouter, useSearchParams} from 'next/navigation';
import {useUser} from '@/components/RequireAuth/RequireAuth';

// Create the context
const CampaignContext = createContext(null as any);

export const useCampaign = () => {
    return useContext(CampaignContext);
};

// CampaignProvider component that wraps the app
export const CampaignProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    // In CampaignProvider.tsx
    const router = useRouter();
    const {showError} = useError();
    const searchParams = useSearchParams();
    const {userInfo} = useUser();
    const campaigns = useMemo(() => {
        return userInfo?.campaigns || [];
    }, [userInfo]);
    const findCampaign = useCallback(
        (seller_id: string) => {
            return campaigns?.find((c: any) => c.seller_id === seller_id) || {};
        },
        [campaigns],
    );
    const [campaignLoaded, setCampaignLoaded] = useState(false);

    const [selectValue, setSelectValue] = useState([''] as string[]); // Current selected campaign
    const [campaignInfo, setCampaignInfo] = useState([{}] as any[]);
    // CampaignProvider.tsx
    const [sellerId, setSellerId] = useState(() => {
        const initialSellerId = searchParams.get('seller_id') || campaigns?.[0]?.seller_id;
        return initialSellerId ?? '';
    });
    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = useState(false); // Flag for switching
    const [availableTags, setAvailableTags] = useState([] as string[]); // Tags related to the selected campaign
    const [availableTagsPending, setAvailableTagsPending] = useState(false); // Loading state for tags
    // const [modulesMap, setModulesMap] = useState({} as any);
    // CampaignProvider.tsx
    const [currentCampaign, setCurrentCampaign] = useState({} as any);

    // const modules = useMemo(() => {
    //     if (!currentCampaign)return [];

    //     return currentCampaign?.isOwner
    //         ? ['all']
    //         : Object.keys(currentCampaign?.userModules || {});
    // }, [currentCampaign]);
    const [modules, setModules] = useState([] as any);

    useEffect(() => {
        setCampaignLoaded(false);
        const sellerIdSearchParams = searchParams.get('seller_id');
        const seller_id = sellerId ? sellerId : sellerIdSearchParams;
        const firstCampaignId = campaigns?.[0]?.seller_id;

        if (!campaigns?.length) return;

        // Prevent redundant updates with stable reference
        const currentParams = searchParams.toString();

        if (!seller_id && firstCampaignId) {
            const newParams = new URLSearchParams(currentParams);
            newParams.set('seller_id', firstCampaignId);
            console.log(newParams);

            // Only update if params actually changed
            if (newParams.toString() !== currentParams) {
                window.history.replaceState(null, '', `?${newParams.toString()}`);
                // router.replace(`?${newParams.toString()}`);
            }

            // Directly set state without waiting for URL change
            const campaign = findCampaign(firstCampaignId);
            if (campaign) {
                setSellerId(firstCampaignId);
                setSelectValue([campaign?.name || '']);
                console.log(campaign, 'campaign');
                setCurrentCampaign(campaign);
                setModules(campaign?.isOwner ? ['all'] : Object.keys(campaign?.userModules || {}));
                setCampaignLoaded(true);
            }
            return;
        }
        // console.log(JSON.stringify(currentCampaign), 'campaign', currentCampaign?.isOwner);
        // console.log(seller_id, sellerId);

        if (seller_id) {
            const campaign = findCampaign(seller_id);
            if (campaign) {
                // Batch state updates
                console.log(currentParams);
                const newParams = new URLSearchParams(currentParams);
                console.log(newParams);
                newParams.set('seller_id', seller_id);
                console.log(newParams);

                setSellerId(seller_id);
                setSelectValue([campaign.name]);
                setCampaignInfo(campaign);
                setModules(campaign?.isOwner ? ['all'] : Object.keys(campaign?.userModules || {}));
                setSwitchingCampaignsFlag(false);
                setCampaignLoaded(true);
                window.history.replaceState(null, '', `?${newParams.toString()}`);
            }
        }
    }, [searchParams, campaigns, sellerId, router, findCampaign]); // Add sellerId to deps

    useEffect(() => {
        if (!selectValue[0]) return;
        setAvailableTagsPending(true);
        setCampaignLoaded(false);
        callApi('getAllTags', {
            uid: getUid(),
            campaignName: selectValue[0],
        })
            .then((res) => {
                if (!res) throw 'No response';
                const {tags} = res['data'] ?? {};
                tags.sort();
                setAvailableTags(tags ?? []);
            })
            .catch((error) => {
                showError(
                    'Ошибка получения тегов: ' +
                        (error.response?.data?.error || 'неизвестная ошибка'),
                );
            })
            .finally(() => {
                setAvailableTagsPending(false);
                setCampaignLoaded(true);
            });
    }, [selectValue]);

    return (
        <CampaignContext.Provider
            value={{
                selectValue,
                setSelectValue,
                campaignInfo,
                setCampaignInfo,
                sellerId,
                setSellerId,
                campaigns,
                campaignLoaded,
                currentCampaign,
                setCurrentCampaign,
                modules,
                switchingCampaignsFlag,
                setSwitchingCampaignsFlag,
                availableTags,
                availableTagsPending,
            }}
        >
            {children}
        </CampaignContext.Provider>
    );
};
