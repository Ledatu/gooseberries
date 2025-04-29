
import ApiClient from "@/utilities/ApiClient";

export const setReferral = async (userId: number, referral: string) => {
	try {
		console.log(userId, referral)
		await ApiClient.post('api/auth/set-referral', { user_id: userId, referral });
	} catch (error) {
		console.error(error);
	}
}