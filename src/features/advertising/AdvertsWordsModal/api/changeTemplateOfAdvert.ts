import ApiClient from '@/utilities/ApiClient';
import {AutoPhrasesTemplate} from './AutoPhrasesTemplateMapper';

export type changeTemplateOfAdvertProps = {
    advertId?: number;
    advertIds?: number[];
    seller_id: string;
    template: AutoPhrasesTemplate;
    // newName? : string
};

export const changeTemplateOfAdvert = async (props: changeTemplateOfAdvertProps) => {
    try {
        console.log(props);
        const res = await ApiClient.post('massAdvert/new/changeAutoPhrasesTemplateOfAdvert', props);
        console.log(res);
    } catch (error: any) {
        throw new Error('error in changeTemplateOfAdvert', error.message);
    }
};
