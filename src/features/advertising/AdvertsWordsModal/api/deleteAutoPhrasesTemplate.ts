import ApiClient from '@/utilities/ApiClient';

export type deleteAutoPhrasesTemplateProps = {
    templateName: string;
    seller_id: string;
};

export const deleteAutoPhrasesTemplate = async (props: deleteAutoPhrasesTemplateProps) => {
    try {
        const res = await ApiClient.post('massAdvert/new/delete-auto-phrases-template', props);
        console.log(res);
    } catch (error: any) {
        throw new Error('error in changeTemplateOfAdvert', error.message);
    }
};
