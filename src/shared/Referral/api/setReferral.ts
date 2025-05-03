import ApiClient from '@/utilities/ApiClient';

export const setReferral = async (
    referral: string,
    refetchUser: Function | undefined = undefined,
) => {
    try {
        console.log(new Date(), 'set-referal', referral);
        await ApiClient.post('auth/set-referral', {referral});
        if (refetchUser) await refetchUser();
    } catch (error) {
        console.error(error);
    }
};
