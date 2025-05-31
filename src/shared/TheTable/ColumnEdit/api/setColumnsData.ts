import ApiClient from "@/utilities/ApiClient";
import { TableDataDto } from "../types/TableDataDto";

export const setColumnData = async (tableId: string, paginationSize?: number, order?: string[], hidden?: string[]): Promise<TableDataDto> => {
	try {
		const res = await ApiClient.post('massAdvert/new/advert/setTableData', { tableId, paginationSize: paginationSize ?? 100, order: order ?? [], hidden: hidden ?? [] });
		if (!res || !res.data || !res.data.tableData) {
			throw new Error("No data in res, data or tableData");
		}
		return res.data.tableData

	} catch (error: any) {
		throw new Error(error);
	}
}