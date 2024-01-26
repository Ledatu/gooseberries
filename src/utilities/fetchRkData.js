import {doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from './firebase-config';
import Userfront from '@userfront/toolkit';
import axios from 'axios';

const getAdverts = (authToken, params) => {
    return axios
        .get('https://advert-api.wb.ru/adv/v1/promotion/count', {
            headers: {
                Authorization: authToken,
            },
            params: params,
        })
        .then((response) => response.data)
        .catch((error) => console.error(error));
};

const {ipAddress} = require('../serverAddress');

const getStatsByDay = () => {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
    axios
        .post(
            `${ipAddress}/api/getStatsByDay`,
            {campaign: 'mayusha'},
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            },
        )
        .then((response) => response.data)
        .catch((error) => console.error(error));
};

const writeAdvertsToDB = async (data, campaignName) => {
    console.log(data);
    const jsonData = {};
    const thisMonth = new Date();
    thisMonth.setDate(thisMonth.getDate() - 31);
    if (!data) {
        console.log(
            campaignName,
            'no data was provided from getAdverts, nothing to write, skipping...',
        );
        return;
    }
    if (!data.adverts) return;
    for (const [_, item] of Object.entries(data.adverts)) {
        if (_) {
        }
        // console.log(item, item.status, new Date(item.changeTime));
        item.advert_list.forEach((adv) => {
            if (item.status == 7 && new Date(adv.changeTime) < thisMonth) return;
            jsonData[adv.advertId] = {
                type: item.type,
                status: item.status,
                advertId: adv.advertId,
                changeTime: adv.changeTime,
            };
        });
    }
    try {
        await setDoc(
            doc(db, `customers/${Userfront.user.userUuid ?? ''}/${campaignName}`, 'adverts'),
            jsonData,
        );
    } catch (e) {
        console.log(e);
    }
};

export const fetchAdvertsAndWriteToDB = (campaignData) => {
    const apiKey = campaignData['api-key'];
    const campaignName = campaignData['campaignName'];
    const params = {};
    return getAdverts(apiKey, params)
        .then((data) => {
            return writeAdvertsToDB(data, campaignName);
        })
        .catch((error) => console.error(error));
};

const getAdvertStats = (authToken, queryParams) => {
    return axios
        .get('https://advert-api.wb.ru/adv/v1/fullstat?' + queryParams, {
            headers: {
                Authorization: authToken,
            },
        })
        .then((response) => response.data)
        .catch((error) => console.error(error));
};

const getAdvertInfo = (authToken, queryParams, params) => {
    return axios
        .post('https://advert-api.wb.ru/adv/v1/promotion/adverts?' + queryParams, params, {
            headers: {
                Authorization: authToken,
            },
        })
        .then((response) => response.data)
        .catch((error) => console.error(error));
};

const fetchAdvertStatsAndWriteToDB = async (campaignData) => {
    const apiKey = campaignData['api-key'];
    const campaignName = campaignData['campaignName'];
    const adverts =
        (
            await getDoc(
                doc(db, `customers/${Userfront.user.userUuid ?? ''}/${campaignName}`, 'adverts'),
            )
        ).data() ?? {};

    // const jsonData = {};
    for (const [type, advertsData] of Object.entries(adverts)) {
        for (const [advertId, advertData] of Object.entries(advertsData)) {
            // console.log(key, id);
            if (!type || !advertId || !advertData) continue;
            const queryParams = new URLSearchParams();
            if (![9, 11].includes(advertData.status)) continue;
            console.log(queryParams);
            queryParams.append('id', advertData.advertId);
            await getAdvertStats(apiKey, queryParams).then(async (pr) => {
                if (!pr) return;
                // jsonData[advertId] = pr;
                console.log(pr);
                try {
                    await setDoc(
                        doc(
                            db,
                            'customers',
                            Userfront.user.userUuid ?? '',
                            campaignName,
                            'adverts',
                            advertId,
                            'fullstat',
                        ),
                        pr,
                        {merge: true},
                    );
                } catch (e) {
                    console.log(e);
                }
            });
            await new Promise((resolve) => setTimeout(resolve, 8000));
        }
    }
};

const fetchAdvertStatsByDayAndWriteToDB = async (campaignData) => {
    const apiKey = campaignData['api-key'];
    const campaignName = campaignData['campaignName'];
    if (apiKey || campaignName) {
    }
    await getStatsByDay().then((pr) => {
        if (!pr) return;
        return pr;
    });
};

const fetchAdvertInfosAndWriteToDB = async (campaignData) => {
    const apiKey = campaignData['api-key'];
    const campaignName = campaignData['campaignName'];
    const adverts =
        (
            await getDoc(
                doc(db, `customers/${Userfront.user.userUuid ?? ''}/${campaignName}`, 'adverts'),
            )
        ).data() ?? {};

    const jsonData = {};
    for (const [type, advertsData] of Object.entries(adverts)) {
        const params = [];
        for (const [advertId, advertData] of Object.entries(advertsData)) {
            // console.log(key, id);
            if (!advertId || !advertData) continue;
            if ([9, 11].includes(advertData.status)) params.push(advertData.advertId);
        }
        if (!params.length) continue;
        console.log(params, apiKey);
        const queryParams = new URLSearchParams();
        queryParams.append('type', type);
        await getAdvertInfo(apiKey, queryParams, params).then((pr) => {
            if (!pr) return;
            jsonData[type] = pr;
        });
    }
    try {
        await setDoc(
            doc(db, `customers/${Userfront.user.userUuid ?? ''}/${campaignName}`, 'advertInfos'),
            jsonData,
        );
    } catch (e) {}
};

const getCards = (authToken, params) => {
    return axios
        .post('https://suppliers-api.wildberries.ru/content/v1/cards/cursor/list', params, {
            headers: {
                Authorization: authToken,
            },
        })
        .then((response) => response.data)
        .catch((error) => console.error(error));
};

const writeVendorCodeToDB = async (data, campaignName) => {
    const jsonData = {};
    const jsonDataFull = {};
    const jsonDataFullByNmId = {};
    const jsonDataBarcodes = {direct: {}, reverse: {}};
    const jsonDataBarcodesFull = {};
    data.forEach((item) => {
        for (const [_, sizeData] of Object.entries(item.sizes)) {
            if (!sizeData && _) continue;
            const size = sizeData.techSize;
            const art = item.vendorCode.replace(/\s/g, '') + (size != '0' ? `_${size}` : '');
            jsonDataBarcodes.direct[art] = sizeData.skus[0];
            jsonDataBarcodes.reverse[sizeData.skus[0]] = art;
            jsonDataBarcodesFull[`${art.replace('.', '@')}`] = {
                art: art,
                object: item.object,
                brand: item.brand,
                size: size,
                color: item.colors[0],
                barcode: sizeData.skus[0],
                nmId: item.nmID,
                brand_art: item.vendorCode.replace(/\s/g, ''),
            };
        }
        jsonData[item.nmID] = item.vendorCode.replace(/\s/g, '');
    });
    data.forEach((item) => {
        jsonDataFull[item.vendorCode.replace(/\s/g, '')] = {
            object: item.object,
            brand: item.brand,
            sizes: item.sizes,
            colors: item.colors,
        };
    });
    data.forEach((item) => {
        jsonDataFullByNmId[item.nmID] = {
            supplierArticle: item.vendorCode.replace(/\s/g, ''),
            object: item.object,
            brand: item.brand,
            sizes: item.sizes,
            colors: item.colors,
        };
    });

    // const arts = ;
    // arts[campaignName] = ;
    // console.log(campaignName, arts);
    try {
        await setDoc(
            doc(db, `customers/${Userfront.user.userUuid ?? ''}/${campaignName}`, 'arts'),
            jsonDataBarcodesFull,
        );
    } catch (e) {}
};

const fetchCardsAndWriteToDB = (campaignData) => {
    const apiKey = campaignData['api-key'];
    const campaignName = campaignData['campaignName'];
    const params = {
        sort: {
            cursor: {
                limit: 1000,
            },
            filter: {
                withPhoto: -1,
            },
        },
    };
    return getCards(apiKey, params)
        .then((cards) => writeVendorCodeToDB(cards.data.cards, campaignName))
        .catch((error) => console.error(error));
};

export const autoFetchCards = async () => {
    const result = (await getDoc(doc(db, 'customers', Userfront.user.userUuid ?? ''))).data();
    if (result)
        for (let i = 0; i < result.campaigns.length; i++) {
            console.log(result, result.campaigns, result.campaigns[i]);
            fetchCardsAndWriteToDB(result.campaigns[i]);
        }
};

export const autoFetchAdverts = async () => {
    const result = (await getDoc(doc(db, 'customers', Userfront.user.userUuid ?? ''))).data();
    if (result)
        for (let i = 0; i < result.campaigns.length; i++) {
            console.log(result, result.campaigns, result.campaigns[i]);
            fetchAdvertsAndWriteToDB(result.campaigns[i]);
        }
};

export const autoFetchAdvertInfos = async () => {
    const result = (await getDoc(doc(db, 'customers', Userfront.user.userUuid ?? ''))).data();
    if (result)
        for (let i = 0; i < result.campaigns.length; i++) {
            console.log(result, result.campaigns, result.campaigns[i]);
            fetchAdvertInfosAndWriteToDB(result.campaigns[i]);
        }
};

export const autoFetchAdvertStats = async () => {
    const result = (await getDoc(doc(db, 'customers', Userfront.user.userUuid ?? ''))).data();
    if (result)
        for (let i = 0; i < result.campaigns.length; i++) {
            console.log(result, result.campaigns, result.campaigns[i]);
            fetchAdvertStatsAndWriteToDB(result.campaigns[i]);
        }
};

export const autoGetAdvertStatsByDay = async () => {
    const result = (await getDoc(doc(db, 'customers', Userfront.user.userUuid ?? ''))).data();
    if (result) {
        const jsonData = {};
        for (let i = 0; i < result.campaigns.length; i++) {
            console.log(result, result.campaigns, result.campaigns[i]);
            jsonData[result.campaigns[i]['campaignName']] = await fetchAdvertStatsByDayAndWriteToDB(
                result.campaigns[i],
            );
        }
        console.log(jsonData);
        return jsonData;
    }
    return {};
};
