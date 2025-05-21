import { getRoundValue } from "@/utilities/getRoundValue";
import { AdvertDateData } from "../types/AdvertDateData";
import { compare } from "@/components/TheTable";

export const getFilteredStats = (withfFilters: any, stats: AdvertDateData[]): AdvertDateData[] => {
	const _stats: AdvertDateData[] = [...stats];
	const _filters = { ...withfFilters };
	_stats.sort((a, b) => {
		const dateA = new Date(a['date']);
		const dateB = new Date(b['date']);
		return dateB.getTime() - dateA.getTime();
	});

	return _stats
		.map((stat: AdvertDateData) => {
			const { sum_orders: SO, orders: O } = stat ?? {};
			const avgPrice = getRoundValue(SO, O);
			return { ...stat, avg_price: avgPrice };
		})
		.filter((stat: AdvertDateData) => {
			for (const [filterArg, data] of Object.entries(_filters)) {
				const filterData: any = data;
				if (filterArg == 'undef' || !filterData) continue;
				if (filterData['val'] == '') continue;
				else if (!compare(stat[filterArg], filterData)) {
					return false;
				}
			}
			return true;
		})
}