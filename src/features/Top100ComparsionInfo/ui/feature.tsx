import ChartKit from '@gravity-ui/chartkit';
import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';
import {Button, Icon, Loader, Popover, Text} from '@gravity-ui/uikit';
import {Star, Comment} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ApiClient from '@/utilities/ApiClient';
interface PageInfoGraphsProps {
    sellerId: string;
    phrase: any;
    placementsValue: any;
}
export const PageInfoGraphs = ({sellerId, phrase, placementsValue}: PageInfoGraphsProps) => {
    const auctionOptions: any[] = [
        {value: 'firstPage', content: 'Выдача'},
        {value: 'auto', content: 'Аукцион Авто'},
        {value: 'search', content: 'Аукцион Поиска'},
    ];
    const [auctionSelectedOption, setAuctionSelectedOption] = useState('firstPage');
    const [auction, setAuction] = useState([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (!open) setAuction([]);
        else {
            getAuction();
            setAuctionSelectedOption(String('firstPage'));
        }
    }, [open]);
    const getAuction = useCallback(async () => {
        if (!open) return;
        try {
            const response = await ApiClient.post('massAdvert/get-auction', {
                seller_id: sellerId,
                type: auctionSelectedOption,
                phrase,
            });
            const {data} = response ?? {};
            if (!data) throw new Error('No data.');
            setAuction(data);
        } catch (error) {
            console.error('error auction', error);
        }
    }, [sellerId, phrase, auctionOptions]);
    const {reviewRating, sizes, feedbacks} = placementsValue ?? {};
    const price = Math.round((sizes?.[0]?.price?.total ?? 0) / 100);
    const _graphs = useMemo(() => {
        if (!auction.length) return undefined;
        const gr = {
            prices: {},
            rating: {},
            feedbacks: {},
        };
        const pricesData: any[] = [];
        const pricesDataCur: any[] = [];
        const reviewRatingsData: any[] = [];
        const reviewRatingsDataCur: any[] = [];
        const feedbacksData: any[] = [];
        const feedbacksDataCur: any[] = [];
        for (let i = 0; i < auction.length; i++) {
            const card = auction[i];
            // console.log(card);
            const {reviewRating, sizes, feedbacks} = card;
            const priceRub = Math.round((sizes?.[0]?.['price']?.['total'] ?? 0) / 100);
            if (!pricesData.includes(priceRub)) pricesData.push(priceRub);
            if (!reviewRatingsData.includes(reviewRating)) reviewRatingsData.push(reviewRating);
            if (!feedbacksData.includes(feedbacks)) feedbacksData.push(feedbacks);
        }

        if (!pricesData.includes(price)) pricesData.push(price);
        pricesData.sort((a, b) => a - b);
        for (let i = 0; i < pricesData.length; i++) {
            if (pricesData[i] == price) {
                pricesDataCur.push(price);
                break;
            } else {
                pricesDataCur.push(null);
            }
        }

        if (!reviewRatingsData.includes(reviewRating)) reviewRatingsData.push(reviewRating);
        reviewRatingsData.sort((a, b) => a - b);
        for (let i = 0; i < reviewRatingsData.length; i++) {
            if (reviewRatingsData[i] == reviewRating) {
                reviewRatingsDataCur.push(reviewRating);
                break;
            } else {
                reviewRatingsDataCur.push(null);
            }
        }

        if (!feedbacksData.includes(feedbacks)) feedbacksData.push(feedbacks);
        feedbacksData.sort((a, b) => a - b);
        for (let i = 0; i < feedbacksData.length; i++) {
            if (feedbacksData[i] == feedbacks) {
                feedbacksDataCur.push(feedbacks);
                break;
            } else {
                feedbacksDataCur.push(null);
            }
        }
        const genYagrData = (
            all: any,
            cur: any,
            colorAll: any,
            title: any,
            axisName: any,
            cursorName: any,
            min = -1,
            colorCur = '#ffbe5c',
        ) =>
            ({
                data: {
                    timeline: [...Array(all.length).keys()],
                    graphs: [
                        {
                            color: colorCur,
                            type: 'column',
                            data: cur,
                            id: '1',
                            name: 'Этот артикул',
                            scale: 'y',
                        },
                        {
                            id: '0',
                            name: cursorName,
                            data: all,
                            color: colorAll,
                            scale: 'y',
                        },
                    ],
                },
                libraryConfig: {
                    chart: {
                        series: {
                            type: 'column',
                        },
                    },
                    axes: {
                        y: {
                            label: axisName,
                            precision: 'auto',
                            show: true,
                        },
                        x: {
                            show: true,
                        },
                    },
                    series: [],
                    scales: {
                        y: {
                            min: min == -1 ? Math.floor(all[0]) : min,
                        },
                    },
                    title: {
                        text: title,
                    },
                },
            }) as YagrWidgetData;
        gr.prices = genYagrData(
            pricesData,
            pricesDataCur,
            '#5fb8a5',
            'Цены топ 100 артикулов по запросу',
            'Цены',
            'Цена',
        );
        gr.rating = genYagrData(
            reviewRatingsData,
            reviewRatingsDataCur,
            '#9a63d1',
            'Рейтинг топ 100 артикулов по запросу',
            'Рейтинг',
            'Рейтинг',
        );
        gr.feedbacks = genYagrData(
            feedbacksData,
            feedbacksDataCur,
            '#4aa1f2',
            'Количество отзывов топ 100 артикулов по запросу',
            'Отзывы',
            'Отзывов',
            0,
        );
        return gr;
    }, [auction]);

    useEffect(() => {
        console.log("GRAPHS INFO:")
        console.log(_graphs)
    }, [_graphs])

    return price ? (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Popover
                onOpenChange={(val) => {
                    setOpen(val);
                }}
                enableSafePolygon={true}
                placement={'right'}
                content={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backdropFilter: 'blur(48px)',
                            WebkitBackdropFilter: 'blur(48px)',
                            boxShadow: '#0006 0px 2px 8px 0px',
                            borderRadius: 30,
                            top: (-450 * 1.3) / 2,
                            border: '1px solid #eee2',
                            width: 700,
                            left: -5,
                            height: 450 * 1.3,
                            overflow: 'auto',
                            position: 'absolute',
                        }}
                    >
                        {!auction.length ? (
                            <motion.div
                                exit={{opacity: 0}}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Loader size="l" />
                            </motion.div>
                        ) : (
                            <motion.div
                                animate={{opacity: 1}}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <div style={{height: '60%'}}>
                                    <ChartKit type="yagr" data={_graphs?.prices as any} />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '100%',
                                        height: '40%',
                                    }}
                                >
                                    <div style={{width: '30%'}}>
                                        <ChartKit type="yagr" data={_graphs?.rating as any} />
                                    </div>
                                    <div style={{width: '70%'}}>
                                        <ChartKit type="yagr" data={_graphs?.feedbacks as any} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                }
            >
                <div style={{display: 'flex', flexDirection: 'column', width: 160}}>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Button width="max" pin="clear-clear" size="xs" view="flat">
                            {`Цена СПП: ${new Intl.NumberFormat('ru-RU').format(price)} ₽`}
                        </Button>
                    </div>
                    <div
                        style={{
                            width: '100%',
                            minHeight: 0.5,
                            background: 'var(--yc-color-base-generic-hover)',
                        }}
                    />
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Button width="max" pin="clear-clear" size="xs" view="flat">
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 3,
                                }}
                            >
                                <Text>{reviewRating}</Text>
                                <Text
                                    color="warning"
                                    style={{display: 'flex', alignItems: 'center'}}
                                >
                                    <Icon data={Star} size={11} />
                                </Text>
                            </div>
                        </Button>
                        <div
                            style={{
                                width: 0.5,
                                background: 'var(--yc-color-base-generic-hover)',
                            }}
                        />
                        <Button width="max" pin="clear-clear" size="xs" view="flat">
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 3,
                                }}
                            >
                                <Text>{feedbacks}</Text>
                                <Icon data={Comment} size={11} />
                            </div>
                        </Button>
                    </div>
                </div>
            </Popover>
        </div>
    ) : (
        <></>
    );
};
