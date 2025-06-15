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

export const setUrlFilters = (filters: FiltersMap) => {
    const url: URL = new URL(window.location.href);
    const searchParams: URLSearchParams = url.searchParams;

    for (const key of Object.keys(filters)) {
        if (searchParams.has(key)) {
            searchParams.delete(key);
        }
    }

    for (const [key, value] of Object.entries(filters)) {
        if (value.val === "" || value.val === "false" || value.val === null || value.val === undefined) {
            continue;
        }

        searchParams.append(key, `${convertComparisonMode(value.compMode)}${value.val}`);
    }

    window.history.pushState({}, '', url.toString());
};

export const getFiltersFromUrl = (filters: FiltersMap): FiltersMap => {
    console.log("getFiltersFromUrl base filters", filters)
    const url: URL = new URL(window.location.href)
    console.log("getFiltersFromUrl url", url)
    const searchParams: URLSearchParams = url.searchParams;

    const newFilters: FiltersMap = { ...filters };

    for (const key of Object.keys(newFilters)) {
        if (searchParams.has(key)) {
            const paramValue = searchParams.get(key) as string;

            if (paramValue.length > 0) {
                const miniMode = paramValue[0] as MiniComparisonMode;
                const value = paramValue.substring(1);

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
    console.log(newFilters)
    return newFilters;
}