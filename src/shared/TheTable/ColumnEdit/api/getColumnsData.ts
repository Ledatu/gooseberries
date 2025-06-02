import ApiClient from "@/utilities/ApiClient";
import { TableDataDto } from "../types/TableDataDto";

export const getColumnData = async (tableId: string): Promise<TableDataDto> => {
	try {
		const res = await ApiClient.post('massAdvert/new/advert/getTableData', { tableId });
		if (!res || !res.data || !res.data.tableData) {
			throw new Error("No data in res, data or tableData");
		}
		return res.data.tableData

	} catch (error: any) {
		throw new Error(error);
	}
}