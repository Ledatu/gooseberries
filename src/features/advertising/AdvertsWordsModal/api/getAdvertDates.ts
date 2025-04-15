import ApiClient from "@/utilities/ApiClient";

export const getAdvertDates = async (advertId: number, sellerId: string): Promise<{ start: Date, end: Date }> => {
	try {
		const res = await ApiClient.post("massAdvert/new/getDatesOfAdvert", { advertId, seller_id: sellerId });
		if (!res || !res.data || !res.data.start || !res.data.end) {
			throw new Error(`No data in res ${res?.data}`);
		}
		return { start: new Date(res.data.start), end: new Date(res.data.end) }
	} catch (error: any) {
		console.error(error)
		throw new Error(error.message);
	}
}