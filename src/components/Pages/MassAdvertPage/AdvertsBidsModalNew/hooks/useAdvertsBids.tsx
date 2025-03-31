import {useCampaign} from '@/contexts/CampaignContext';
// import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {getLocaleDateString} from '@/utilities/getRoundValue';
import {useEffect, useState} from 'react';

interface useAdvertBidsProps {
    doc: any;
    setChangedDoc: Function;
    advertId: number | undefined;
    getUniqueAdvertIdsFromThePage: Function | undefined;
}

export const useAdvertBids = ({
    setChangedDoc,
    doc,
    advertId,
    getUniqueAdvertIdsFromThePage,
}: useAdvertBidsProps) => {
    const [open, setOpen] = useState(false);

    // const {showError} = useError();
    const {sellerId, selectValue} = useCampaign();
    // const [open, setOpen] = useState(false);
    const modalOptions = [
        {value: 'Автоставки', content: 'Автоставки'},
        {value: 'Установить', content: 'Установить'},
    ];

    const advertIds = (() => {
        if (advertId) return [advertId];
        if (!getUniqueAdvertIdsFromThePage) return [];
        const temp = [] as number[];
        const uniqueAdvertsIds = getUniqueAdvertIdsFromThePage();
        for (const [_, data] of Object.entries(uniqueAdvertsIds)) {
            const advertData: any = data;
            if (!advertData) continue;
            const id = advertData['advertId'];
            if (!temp.includes(id)) temp.push(id);
        }
        return temp;
    })();

    const autoBidderOptions = [
        {
            value: 'placements',
            content: 'Место в выдаче',
        },
        {
            value: 'auction',
            content: 'Позиция в аукционе',
        },
        {
            value: 'bestPlacement',
            content: 'Топ позиция',
        },
        {
            value: 'orders',
            content: 'Заказы, шт.',
        },
        {
            value: 'sum_orders',
            content: 'Сумма заказов, руб.',
        },
        {
            value: 'obor',
            content: 'Оборачиваемость, дней',
        },
        {
            value: 'sellByDate',
            content: 'Распродать к дате',
        },
        {
            value: 'sum',
            content: 'Плановый расход',
        },
        {
            value: 'drr',
            content: 'Целевой ДРР',
        },
        {
            value: 'cpo',
            content: 'Целевой CPO',
        },
        {
            value: 'delete',
            content: 'Удалить автоставки',
        },
    ];
    const [usePlacementsTrigger, setUsePlacementsTrigger] = useState(false);
    const [modalOption, setModalOption] = useState(modalOptions[0].value);
    const [autoBidderOption, setAutoBidderOption] = useState([autoBidderOptions[0].value]);
    const [cpm, setCpm] = useState(125);
    const [drr, setDrr] = useState(10);
    const [cpo, setCpo] = useState(50);
    const [orders, setOrders] = useState(10);
    const [sumOrders, setSumOrders] = useState(1000);
    const [sum, setSum] = useState(50);
    const [placements, setPlacements] = useState(50);
    const [placementsTrigger, setPlacementsTrigger] = useState(10);
    const [auction, setAuction] = useState(50);
    const [obor, setObor] = useState(30);
    const [maxCpm, setMaxCpm] = useState(1000);
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const [sellByDate, setSellByDate] = useState<Date | undefined>(date);
    const [useAutoBudget, setUseAutoBudget] = useState<boolean>(false);
    const [useMaxBudget, setUseMaxBudget] = useState<boolean>(false);
    const [maxBudget, setMaxBudget] = useState(1000);
    const [useAutoMaxCpm, setUseAutoMaxCpm] = useState(true);
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        if (
            ['sellByDate', 'orders', 'sum_orders', 'obor'].includes(autoBidderOption[0]) &&
            useAutoMaxCpm
        )
            return;
        setUseAutoBudget(false);
    }, [autoBidderOption, useAutoMaxCpm]);

    useEffect(() => {
        if (useAutoBudget) return;
        setUseMaxBudget(false);
        setMaxBudget(1000);
    }, [useAutoBudget]);

    const getRules = async () => {
        setIsLoaded(false);
        const params = {
            seller_id: sellerId,
            advertId: advertId,
        };
        console.log(params);
        try {
            const res = await ApiClient.post('massAdvert/get-one-advert-auto-bids-rules', params);
            console.log(res);
            if (!res || !res.data || !res.data.rules) {
                throw new Error('There is no data in res');
            }
            const functions = {
                usePlacementsTrigger: setUsePlacementsTrigger,
                modalOption: setModalOption,
                autoBidderOption: setAutoBidderOption,
                cpm: setCpm,
                drr: setDrr,
                cpo: setCpo,
                orders: setOrders,
                sumOrders: setSumOrders,
                sum: setSum,
                placements: setPlacements,
                placementsTrigger: setPlacementsTrigger,
                auction: setAuction,
                obor: setObor,
                maxCpm: setMaxCpm,
                sellByDate: setSellByDate,
                useAutoBudget: setUseAutoBudget,
                useMaxBudget: setUseMaxBudget,
                maxBudget: setMaxBudget,
                useAutoMaxCpm: setUseAutoMaxCpm,
            };
            for (const [key, func] of Object.entries(functions)) {
                if (res.data.rules[key]) {
                    func(res.data.rules[key]);
                }
            }
            setIsLoaded(true);
        } catch (error) {
            console.error(error);
        }
    };

    const setNewRules = async () => {
        const params = {
            seller_id: sellerId,
            rules: {
                autoBidsMode: autoBidderOption[0],
                placements: autoBidderOption[0] == 'auction' ? auction : placements,
                desiredOrders:
                    autoBidderOption[0] == 'obor' ||
                    autoBidderOption[0] == 'sum_orders' ||
                    autoBidderOption[0] == 'sellByDate'
                        ? null
                        : orders,
                desiredDRR: drr,
                desiredCpo: cpo,
                desiredSum: sum,
                desiredObor: obor,
                placementsTrigger: usePlacementsTrigger ? placementsTrigger : undefined,
                desiredSumOrders: sumOrders,
                bid: cpm,
                maxBid: maxCpm,
                useManualMaxCpm: !useAutoMaxCpm,
                useAutoBudget,
                useMaxBudget,
                maxBudget: useMaxBudget ? maxBudget : undefined,
                sellByDate:
                    autoBidderOption[0] == 'sellByDate' && sellByDate
                        ? getLocaleDateString(sellByDate, 10)
                        : undefined,
            },
            advertIds: advertIds,
        };
        try {
            const res = await ApiClient.post('massAdvert/set-adverts-auto-bids-rules', params);
            console.log(res);
            if (!res || !res.data || !res.data.rules) {
                throw new Error(`error in res or res data or rules not info ${res}`);
            }
            doc.advertsAutoBidsRules[selectValue[0]] = res.data.rules;
            setChangedDoc(doc);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteRules = async () => {
        const params = {
            sellerId: sellerId,
            advertId: advertId,
        };
        try {
            const res = await ApiClient.post('massAdvert/delete-adverts-auto-bids-rules', params);
            if (!res || !res.data || res.data.rules) {
                throw new Error(`error in res or res data or rules not info ${res}`);
            }
            doc.advertsAutoBidsRules[selectValue[0]] = res.data.rules;
            setChangedDoc(doc);
        } catch (error) {
            console.error(error);
        }
    };
    const handleClick = () => {
        const params = {
            seller_id: sellerId,
            rules: {
                autoBidsMode: autoBidderOption[0],
                placements: autoBidderOption[0] == 'auction' ? auction : placements,
                desiredOrders:
                    autoBidderOption[0] == 'obor' ||
                    autoBidderOption[0] == 'sum_orders' ||
                    autoBidderOption[0] == 'sellByDate'
                        ? null
                        : orders,
                desiredDRR: drr,
                desiredCpo: cpo,
                desiredSum: sum,
                desiredObor: obor,
                placementsTrigger: usePlacementsTrigger ? placementsTrigger : undefined,
                desiredSumOrders: sumOrders,
                bid: cpm,
                maxBid: maxCpm,
                useManualMaxCpm: !useAutoMaxCpm,
                useAutoBudget,
                useMaxBudget,
                maxBudget: useMaxBudget ? maxBudget : undefined,
                sellByDate:
                    autoBidderOption[0] == 'sellByDate' && sellByDate
                        ? getLocaleDateString(sellByDate, 10)
                        : undefined,
            },
            advertIds: advertIds,
        };
        console.log(params);
    };

    useEffect(() => {
        if (advertId && open) {
            getRules();
        }
    }, [advertId, open]);

    return {
        advertIds,
        cpm,
        setCpm,
        drr,
        setDrr,
        cpo,
        setCpo,
        orders,
        setOrders,
        sumOrders,
        setSumOrders,
        sum,
        setSum,
        placements,
        setPlacements,
        placementsTrigger,
        setPlacementsTrigger,
        auction,
        setAuction,
        obor,
        setObor,
        maxCpm,
        setMaxCpm,
        sellByDate,
        setSellByDate,
        useAutoBudget,
        setUseAutoBudget,
        useMaxBudget,
        setUseMaxBudget,
        maxBudget,
        setMaxBudget,
        useAutoMaxCpm,
        setUseAutoMaxCpm,
        setNewRules,
        deleteRules,
        usePlacementsTrigger,
        setUsePlacementsTrigger,
        modalOption,
        setModalOption,
        autoBidderOption,
        setAutoBidderOption,
        autoBidderOptions,
        handleClick,
        open,
        setOpen,
        modalOptions,
        isLoaded,
    };
};
