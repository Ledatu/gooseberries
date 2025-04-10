import ApiClient from '@/utilities/ApiClient';
import {AutoPhrasesTemplateMapper} from './AutoPhrasesTemplateMapper';

export type changeTemplateOfAdvertProps = {
    advertId?: number;
    advertIds?: number[];
    seller_id: string;
    templateName: string;
};

export const changeTemplateNameOfAdvert = async (props: changeTemplateOfAdvertProps) => {
    try {
        const res = await ApiClient.post(
            'massAdvert/new/changeAutoPhrasesTemplateNameOfAdvert',
            props,
        );
        console.log(res);
        if ((!res || !res.data || !res.data.template) && props?.advertId) {
            throw new Error(`No data for ${props.advertId}`);
        }
        const template: AutoPhrasesTemplateDto = res?.data?.template;
        if (template) return AutoPhrasesTemplateMapper(template);
        return;
    } catch (error: any) {
        console.error(error);
        throw new Error('error in changeTemplateOfAdvert', error.message);
    }
};
