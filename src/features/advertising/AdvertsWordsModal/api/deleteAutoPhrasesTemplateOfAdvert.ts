import ApiClient from '@/utilities/ApiClient';

export type deleteAutoPhrasesTemplateOfAdvertProps = {
    advertId?: number;
    advertIds?: number[];
    seller_id: string;
};

export const deleteAutoPhrasesTemplateOfAdvert = async (
    props: deleteAutoPhrasesTemplateOfAdvertProps,
) => {
    try {
        const res = await ApiClient.post('massAdvert/new/deleteAutoPhrasesTemplateOfAdvert', props);
        console.log(res);
        // if (!res || !res.data || !res.data.template) {
        //     throw new Error(`No data for ${props.advertId}`);
        // }
    } catch (error: any) {
        throw new Error('error in changeTemplateOfAdvert', error.message);
    }
};
