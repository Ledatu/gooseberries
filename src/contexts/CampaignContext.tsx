import React, {createContext, useContext, useState, useEffect} from 'react';
import {useError} from 'src/pages/ErrorContext';
import callApi, {getUid} from 'src/utilities/callApi';

// Create the context
const CampaignContext = createContext(null as any);

export const useCampaign = () => {
    return useContext(CampaignContext);
};

// CampaignProvider component that wraps the app
export const CampaignProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {showError} = useError();
    const [selectValue, setSelectValue] = useState([''] as string[]); // Current selected campaign
    const [switchingCampaignsFlag, setSwitchingCampaignsFlag] = useState(false); // Flag for switching
    const [availableTags, setAvailableTags] = useState([] as string[]); // Tags related to the selected campaign
    const [availableTagsPending, setAvailableTagsPending] = useState(false); // Loading state for tags

    // Effect to fetch tags when the selected campaign changes
    useEffect(() => {
        if (!selectValue[0]) return;

        setAvailableTagsPending(true);
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
            });
    }, [selectValue]);

    return (
        <CampaignContext.Provider
            value={{
                selectValue,
                setSelectValue,
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
