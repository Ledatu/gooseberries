import { getLocaleDateString } from "@/utilities/getRoundValue";
import { AdvertDateData } from "../types/AdvertDateData";
import { getDefaultAdvertDateData } from "../config/getDefaultAdvertDateData";

export const getComparison = (data: AdvertDateData[]) => {
	let comparison: { [key: string]: AdvertDateData } = {};
	for (let i = data.length - 1; i >= 0; i--) {
		const dateString = getLocaleDateString(data[i].date);
		if (i == data.length - 1) {
			comparison[dateString] = { ...getDefaultAdvertDateData(), date: data[i].date };
		}
		else {
			const temp = getDefaultAdvertDateData();
			for (const key of Object.keys(data[i])) {
				temp[key] = data[i][key] - data[i + 1][key]
			}
			comparison[dateString] = temp;
		}
	}
	return comparison;

}