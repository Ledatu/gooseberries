import ApiClient from '@/utilities/ApiClient';

interface fetchAutoPhrasesTemplateParams {
    seller_id: string;
}

export async function fetchAllTimeTimestamp(sellerId: string) {
    try {
        const params: fetchAutoPhrasesTemplateParams = {seller_id: sellerId};
        console.log(params);
        const res = await ApiClient.post('massAdvert/new/get-campaign-fetch-all-timestamp', params);
        console.log(res);
        if (!res || !res.data) {
            throw new Error('Error, didnt get data of advertId');
        }
        const timestamp: number = Number(res.data ?? '-1');
        return timestamp;
    } catch (error) {
        console.error(error);
        throw new Error('error while fetchAutoPhrasesTemplate');
    }
}
