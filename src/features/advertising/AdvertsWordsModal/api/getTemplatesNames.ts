import ApiClient from "@/utilities/ApiClient"


export const getTemplateNames = async (sellerId: string) => {
	try {
		const res = await ApiClient.post('massAdvert/new/getAutoPhrasesTemplatesNames', { seller_id: sellerId });
		if (!res || !res.data || res.data.templates === undefined) {
			throw new Error("No data in res");
		}
		console.log(res.data.templates);
		return res.data.templates
	} catch (error: any) {
		throw new Error("error in getTemplateNames", error);

	}
}