// EXAMPLE OF FILTERS DATA (not only these filters)
// Value can be empty string
//     "analytics": {
//     "val": "123",
//         "compMode": "include"
// },
//     "placements": {
//     "val": "123",
//         "compMode": "not include"
// },
//     "sum": {
//     "val": "123",
//         "compMode": "equal"
// },
//     "drr": {
//     "val": "123",
//         "compMode": "not equal"
// },
//     "sum_orders": {
//     "val": "123",
//         "compMode": "bigger"
// },
//     "stocks": {
//     "val": "123",
//         "compMode": "not bigger"
// },

type ComparisonMode = "include" | "not include" | "equal" | "not equal" | "bigger" | "not bigger";
type MiniComparisonMode = "+" | "-" | "=" | "!" | '>' | '<'

const CompModesMap: Map<ComparisonMode, MiniComparisonMode>  = new Map([
    ["include", "+"],
    ["not include", "-"],
    ["equal", "="],
    ["not equal", "!"],
    ["bigger", ">"],
    ["not bigger", "<"]
]);

interface FilterValue {
    val: string | false;
    compMode: ComparisonMode;
}

interface FiltersMap {
    [key: string]: FilterValue
}

const convertComparisonMode = (mode: ComparisonMode): MiniComparisonMode => {
    return CompModesMap.get(mode) as MiniComparisonMode
}

const convertMiniComparisonMode = (miniMode: MiniComparisonMode): ComparisonMode | undefined => {
    for (const [key, value] of CompModesMap.entries()) {
        if (value === miniMode) {
            return key;
        }
    }
    return undefined;
};

export const setUrlFilters = (tableId: string, filters: FiltersMap) => {
    const url: URL = new URL(window.location.href);
    const searchParams: URLSearchParams = url.searchParams;

    for (const key of Object.keys(filters)) {
        const prefixedKey = `${tableId}_${key}`;
        if (searchParams.has(prefixedKey)) {
            searchParams.delete(prefixedKey);
        }
    }

    for (const [key, value] of Object.entries(filters)) {
        if (value.val === "" || value.val === "false" || value.val === null || value.val === undefined) {
            continue;
        }
        const prefixedKey = `${tableId}_${key}`;
        searchParams.append(prefixedKey, `${convertComparisonMode(value.compMode)}${value.val}`);
    }

    window.history.pushState({}, '', url.toString());
};

export const getFiltersFromUrl = (tableId: string, baseFilters: FiltersMap): FiltersMap => {
    const url: URL = new URL(window.location.href);
    const searchParams: URLSearchParams = url.searchParams;

    const newFilters: FiltersMap = { ...baseFilters };

    for (const key of Object.keys(newFilters)) {
        const prefixedKey = `${tableId}_${key}`;
        if (searchParams.has(prefixedKey)) {
            const paramValue = searchParams.get(prefixedKey) as string;

            if (paramValue.length > 0) {
                const miniMode = paramValue[0] as MiniComparisonMode;
                let value = paramValue.substring(1);

                if (value === "%2B") {
                    value =  "+"
                }

                if (value === "%2D") {
                    value = "-"
                }

                const comparisonMode = convertMiniComparisonMode(miniMode);

                if (comparisonMode) {
                    newFilters[key] = {
                        val: value === "false" ? false : value,
                        compMode: comparisonMode
                    };
                }
            } else {
                newFilters[key].val = "";
            }
        }
    }
    return newFilters;
};


export interface SortItem {
    columnId: string;
    order: 1 | -1;
}

export const setUrlSorts = (tableId: string, sorts: SortItem[]) => {
    const url: URL = new URL(window.location.href);
    const searchParams: URLSearchParams = url.searchParams;

    const sortPrefix = `${tableId}_sort_`;

    const keysToDelete = Array.from(searchParams.keys()).filter(key => key.startsWith(sortPrefix));
    keysToDelete.forEach(key => searchParams.delete(key));

    sorts.forEach((sortItem, _) => {
        const paramKey = `${sortPrefix}${sortItem.columnId}`;
        searchParams.append(paramKey, sortItem.order.toString());
    });

    window.history.pushState({}, '', url.toString());
};

export const getSortsFromUrl = (tableId: string): SortItem[] => {
    const url: URL = new URL(window.location.href);
    const searchParams: URLSearchParams = url.searchParams;

    const currentSorts: SortItem[] = [];
    const sortPrefix = `${tableId}_sort_`;

    searchParams.forEach((value, key) => {
        if (key.startsWith(sortPrefix)) {
            const columnId = key.substring(sortPrefix.length);
            const order = parseInt(value, 10);

            if (columnId && (order === 1 || order === -1)) {
                currentSorts.push({ columnId, order: order as 1 | -1 });
            }
        }
    });

    return currentSorts;
};
