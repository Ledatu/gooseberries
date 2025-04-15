import ApiClient from '@/utilities/ApiClient';

export type findNmIdPositionProps = {
    seller_id: string;
    phrases: string[];
    nmId: number;
};

export const findNmIdPosition = async (props: findNmIdPositionProps) => {
    try {
        console.log(props);
        const res = await ApiClient.post('massAdvert/new/find-nmId-position', props);
        console.log(res);
        return res;
    } catch (error: any) {
        throw new Error('error in findNmIdPosition', error.message);
    }
};
