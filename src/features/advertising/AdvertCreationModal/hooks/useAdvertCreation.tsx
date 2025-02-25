import {useState} from 'react';
import ApiClient from '@/utilities/ApiClient';
import {useError} from '@/contexts/ErrorContext';
import {useCampaign} from '@/contexts/CampaignContext';

export const useAdvertCreation = (sellerId: string, doc: any, setChangedDoc: Function) => {
    const {showError} = useError();
    const {selectValue} = useCampaign();

    const [open, setOpen] = useState<boolean>(false);
    const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
    const [advertsCount, setAdvertsCount] = useState<number>(0);
    const [createAdvertsMode, setCreateAdvertsMode] = useState<boolean>(false);
    const [advertTypeSwitchValue, setAdvertTypeSwitchValue] = useState(['Авто']);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleConfirmationClose = () => setConfirmationOpen(false);

    const handleCreateButtonClick = (filteredData: any[]) => {
        const count: number = filteredData.filter(
            (item: any) => item.art !== undefined && item.nmId !== undefined,
        ).length;
        setAdvertsCount(count);
        setConfirmationOpen(true);
        setOpen(false);
    };

    const calculateSum = (): number => {
        if (createAdvertsMode) {
            return advertsCount;
        }
        if (advertTypeSwitchValue[0] === 'Авто') {
            return Math.ceil(advertsCount / 100);
        } else {
            return Math.ceil(advertsCount / 50);
        }
    };

    const handleConfirmCreate = async (filteredData: any[]) => {
        setConfirmationOpen(false);

        const params: any = {
            seller_id: sellerId,
            data: {
                arts: {},
                mode: createAdvertsMode,
                budget: 1000,
                bid: 10,
                type: advertTypeSwitchValue[0],
            },
        };
        for (let i: number = 0; i < filteredData.length; i++) {
            const {art, nmId} = filteredData[i] as any;
            if (art === undefined || nmId === undefined) continue;
            params.data.arts[art] = {art, nmId};
        }

        try {
            const res = await ApiClient.post('massAdvert/create-adverts', params);
            if (!res) return;

            const advertsInfosPregenerated = res['data'];
            if (advertsInfosPregenerated)
                for (const [advertId, data] of Object.entries(advertsInfosPregenerated)) {
                    const advertsData: any = data;
                    if (!advertId || !advertsData) continue;
                    advertsData['daysInWork'] = 1;
                    doc['adverts'][selectValue[0]][advertId] = advertsData;

                    const type = advertsData['type'];
                    let nms = [] as any[];
                    if (type == 8) {
                        nms = advertsData['autoParams']
                            ? (advertsData['autoParams'].nms ?? [])
                            : [];
                    } else if (type == 9) {
                        nms = advertsData['unitedParams']
                            ? (advertsData['unitedParams'][0].nms ?? [])
                            : [];
                    }

                    for (const [art, data] of Object.entries(doc['campaigns'][selectValue[0]])) {
                        const artData: any = data;
                        if (!art || !artData) continue;
                        if (nms.includes(artData['nmId'])) {
                            if (!doc['campaigns'][selectValue[0]][art]['adverts'])
                                doc['campaigns'][selectValue[0]][art]['adverts'] = {};
                            doc['campaigns'][selectValue[0]][art]['adverts'][advertId] = {
                                advertId: advertId,
                            };
                        }
                    }
                }

            setChangedDoc({...doc});
        } catch (error: any) {
            showError(error.response?.data?.error || 'Не удалось создать РК.');
        }
    };

    return {
        open,
        confirmationOpen,
        advertsCount,
        createAdvertsMode,
        advertTypeSwitchValue,
        setAdvertTypeSwitchValue,
        setCreateAdvertsMode,
        handleOpen,
        handleClose,
        handleConfirmationClose,
        handleCreateButtonClick,
        calculateSum,
        handleConfirmCreate,
    };
};
