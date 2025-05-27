import ApiClient from '@/utilities/ApiClient';

interface changeSelectedPhraseProps {
    seller_id: string;
    advertId?: number;
    advertIds?: number[];
    selectedPhrase: string;
    deleteSelectedPhrase?: boolean;
    asSet?: boolean;
}

export const changeSelectedPhrase = async ({
    seller_id,
    advertId,
    advertIds,
    selectedPhrase,
    deleteSelectedPhrase = false,
    asSet = false,
}: changeSelectedPhraseProps) => {
    try {
        const res = await ApiClient.post('massAdvert/new/changeAdvertSelectedPhrase', {
            seller_id,
            advertId,
            advertIds,
            selectedPhrase,
            asSet,
            deleteSelectedPhrase,
        });
        console.log(res);
    } catch (error: any) {
        throw new Error(error);
    }
};
