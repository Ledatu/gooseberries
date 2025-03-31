import ApiClient from "@/utilities/ApiClient"

export const fetchSelectedPhrase = async (seller_id: string, advertId: number) => {
	try {
		const res = await ApiClient.post('massAdvert/new/getAdvertSelectedPhrase', { seller_id, advertId });
		return res?.data?.selectedPhrase ?? '';
	} catch (error: any) {
		console.error(new Date(), 'error', error)
		throw new Error("error while getting selected phrase", error)
	}
}