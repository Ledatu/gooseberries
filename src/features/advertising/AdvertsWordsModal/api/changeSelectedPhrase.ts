import ApiClient from '@/utilities/ApiClient';

interface changeSelectedPhraseProps {
    seller_id: string;
    advertId: number;
    selectedPhrase: string;
    asSet?: boolean;
}

export const changeSelectedPhrase = async ({
    seller_id,
    advertId,
    selectedPhrase,
    asSet = false,
}: changeSelectedPhraseProps) => {
    try {
        const res = await ApiClient.post('massAdvert/new/changeAdvertSelectedPhrase', {
            seller_id,
            advertId,
            selectedPhrase,
            asSet,
        });
        console.log(res);
    } catch (error: any) {
        throw new Error(error);
    }
};
