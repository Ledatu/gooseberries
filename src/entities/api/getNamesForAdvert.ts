import ApiClient from "@/utilities/ApiClient"

export const getNamesForAdverts = async (seller_id: string) => {
	try {
		const res = await ApiClient.post('massAdvert/new/getAllTemplateNamesOfAdvert', { seller_id });
		console.log('getNamesForAdverts', res);
		if (!res || !res.data) {
			throw new Error('No data in res');
		}
		return res.data.names
		

	} catch (error: any) {
		throw new Error("Error while getting names for adverts", error)
	}
}