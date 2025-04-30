import {useUser} from '@/components/RequireAuth';
import ApiClient from '@/utilities/ApiClient';

export const setReferral = async (referral: string) => {
    try {
        const {refetchUser} = useUser();
        console.log(new Date(), 'set-referal', referral);
        await ApiClient.post('auth/set-referral', {referral});
        await refetchUser();
    } catch (error) {
        console.error(error);
    }
};
