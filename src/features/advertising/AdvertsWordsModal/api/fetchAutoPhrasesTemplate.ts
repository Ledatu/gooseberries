// import ApiClient from "@/utilities/ApiClient";
import ApiClient from "@/utilities/ApiClient";
import { AutoPhrasesTemplateMapper } from "./AutoPhrasesTemplateMapper";

interface fetchAutoPhrasesTemplateParams {
	advertId: number,
	seller_id: string,
}

export async function fetchAutoPhrasesTemplate(advertId: number, sellerId: string) {
	try {
		const params: fetchAutoPhrasesTemplateParams = { advertId, seller_id: sellerId };
		console.log(params)
		const res = await ApiClient.post('massAdvert/new/getAutoPhrasesTemplate', params);
		console.log(res);
		if (!res || !res.data) {
			throw new Error('Error, didnt get data of advertId');
		}
		const template: AutoPhrasesTemplateDto = res.data.template;
		return AutoPhrasesTemplateMapper(template);
	} catch (error) {
		console.error(error);
		throw new Error('error while fetchAutoPhrasesTemplate');
	}

}