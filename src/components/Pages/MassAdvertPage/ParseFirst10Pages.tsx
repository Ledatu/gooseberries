'use client';

import {getRoundValue} from '@/utilities/getRoundValue';
import axios from 'axios';

export const parseFirst10Pages = async (
    searchPhrase: any,
    setFetchedPlacements: (arg?: any) => any,
    setCurrentParsingProgress: (arg?: any) => any,
    pagesCount = 20,
    startPage = 0,
    startValuesList = {
        updateTime: '',
        data: {},
        cpms: {firstPage: [] as any[], search: [] as any[], auto: [] as any[]},
    },
    startValuesProg = {
        max: pagesCount * 100,
        progress: 0,
        warning: false,
        error: false,
        isParsing: false,
    },
) => {
    const allCardDataList: any = startValuesList ?? {
        updateTime: '',
        data: {},
        cpms: {firstPage: [], search: [], auto: []},
    };

    setCurrentParsingProgress((obj: any) => {
        const curVal = Object.assign({}, obj);
        if (startValuesProg) {
            startValuesProg.error = false;
            startValuesProg.warning = false;
        }
        curVal[searchPhrase] = startValuesProg ?? {
            max: pagesCount * 100,
            progress: 0,
            warning: false,
            error: false,
            isParsing: false,
        };
        return curVal;
    });

    const fetchedPlacements: any = {};

    let retryCount = 0;
    for (let page = startPage + 1; page <= pagesCount; page++) {
        // retryCount = 0;
        const url = `https://search.wb.ru/exactmatch/ru/common/v5/search?ab_testing=false&appType=64&page=${page}&curr=rub&dest=-1257218&query=${encodeURIComponent(
            searchPhrase,
        )}&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data && data.data && data.data.products && data.data.products.length == 100) {
                const myData: any = {};
                const cpms: any = {firstPage: [] as any[], search: [] as any[], auto: [] as any[]};
                for (let i = 0; i < data.data.products.length; i++) {
                    const cur = data.data.products[i];
                    cur.index = i + 1 + (page - 1) * 100;
                    const {id, log, name, brand, supplier} = cur;

                    cur.sppPrice = getRoundValue(
                        cur.sizes
                            ? cur.sizes[0]
                                ? cur.sizes[0].price
                                    ? (cur.sizes[0].price.total ?? 0)
                                    : 0
                                : 0
                            : 0,
                        100,
                    );

                    const {tp} = log ?? {};
                    if (tp) {
                        const advertsType = tp == 'b' ? 'auto' : tp == 'c' ? 'search' : 'none';
                        cur.log.advertsType = advertsType;
                        cur.advertsType = advertsType;

                        cur.log.name = name;
                        cur.log.brand = brand;
                        cur.log.id = id;
                        cur.log.supplier = supplier;
                        cur.position = log.position;
                        cur.promoPosition = log.promoPosition;
                        cur.cpm = log.cpm;

                        cur.avgBoostPrice = getRoundValue(
                            log.cpm,
                            cur.position - cur.promoPosition,
                        );
                        cur.log.avgBoostPrice = cur.avgBoostPrice;

                        if (!cpms[advertsType]) cpms[advertsType] = [];
                        cpms[advertsType].push(cur.log);
                        cur.cpmIndex =
                            allCardDataList.cpms[advertsType].length + cpms[advertsType].length;
                    }

                    setCurrentParsingProgress((obj: any) => {
                        const curVal = Object.assign({}, obj);
                        if (!curVal[searchPhrase]) curVal[searchPhrase] = {max: pagesCount * 100};
                        if (cur.index == pagesCount * 100) curVal[searchPhrase].warning = false;
                        if (cur.index % 100 == 0) {
                            curVal[searchPhrase].progress = cur.index;
                        }
                        curVal[searchPhrase].isParsing =
                            curVal[searchPhrase].progress != curVal[searchPhrase].max &&
                            !curVal[searchPhrase].error;
                        return curVal;
                    });

                    myData[id] = cur;

                    cpms.firstPage.push(cur);
                }

                Object.assign(allCardDataList.data, myData);
                for (const item of cpms.firstPage) {
                    allCardDataList.cpms.firstPage.push(item);
                }
                for (const item of cpms.search) {
                    allCardDataList.cpms.search.push(item);
                }
                for (const item of cpms.auto) {
                    allCardDataList.cpms.auto.push(item);
                }
                // console.log(allCardDataList.cpms, cpms);

                console.log(`Data saved for search phrase: ${searchPhrase}, page: ${page}`);
                await new Promise((resolve) => setTimeout(resolve, 400));
            } else {
                page--;
                retryCount++;
                // await new Promise((resolve) => setTimeout(resolve, 1000));
                if (retryCount % 100 == 0) {
                    console.log(searchPhrase, retryCount);
                    setCurrentParsingProgress((curVal: any) => {
                        if (!curVal[searchPhrase])
                            curVal[searchPhrase] = {max: pagesCount * 100, progress: 0};
                        curVal[searchPhrase].warning = true;
                        curVal[searchPhrase].isParsing =
                            curVal[searchPhrase].progress != curVal[searchPhrase].max &&
                            !curVal[searchPhrase].error;
                        return curVal;
                    });
                    // await new Promise((resolve) => setTimeout(resolve, 100));
                }
                if (retryCount == 200) {
                    retryCount = 0;
                    setCurrentParsingProgress((curVal: any) => {
                        if (!curVal[searchPhrase]) curVal[searchPhrase] = {max: pagesCount * 100};
                        if (curVal[searchPhrase].progress < 100) {
                            curVal[searchPhrase].progress = curVal[searchPhrase].max;
                        }
                        curVal[searchPhrase].error = true;
                        curVal[searchPhrase].isParsing =
                            curVal[searchPhrase].progress != curVal[searchPhrase].max &&
                            !curVal[searchPhrase].error;
                        return curVal;
                    });
                    break;
                }
                // console.log(`Not enough data for search phrase: ${searchPhrase} on page ${page} only ${data.data.products.length} retrying`);
            }
        } catch (error) {
            console.error(
                `Error fetching data for search phrase: ${searchPhrase}, page: ${page}`,
                error,
            );
        }
    }

    if (
        allCardDataList &&
        allCardDataList.data &&
        Object.keys(allCardDataList.data).length >= 1 * 100
    ) {
        allCardDataList.updateTime = new Date().toISOString();

        fetchedPlacements[searchPhrase] = allCardDataList;
        setFetchedPlacements(fetchedPlacements);

        console.log(`All data saved for search phrase: ${searchPhrase}`);
    }
    console.log(allCardDataList);
};
