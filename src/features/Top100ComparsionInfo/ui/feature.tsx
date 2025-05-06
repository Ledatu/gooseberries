import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Icon, Loader, Popover, Text} from '@gravity-ui/uikit';
import {Star, Comment} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import ApiClient from '@/utilities/ApiClient';
import {PieChart} from '@/shared/ui/PieChart/component';
import {BarChartComponent} from '@/shared/ui/BarChart';
import {convertToChartPie} from '../lib/converters/convertToChartPie';

interface PageInfoGraphsProps {
    sellerId: string;
    phrase: any;
    placementsValue: any;
}

interface GraphData {
    prices: {
        labels: string[];
        datasets: {
            label: string;
            data: (number | null)[];
            backgroundColor: string;
        }[];
    };
    rating: {
        labels: string[];
        datasets: {
            label: string;
            data: (number | null)[];
            backgroundColor: string;
        }[];
    };
    feedbacks: {
        labels: string[];
        datasets: {
            label: string;
            data: (number | null)[];
            backgroundColor: string;
        }[];
    };
}

export const PageInfoGraphs = ({sellerId, phrase, placementsValue}: PageInfoGraphsProps) => {
    const [auctionSelectedOption, setAuctionSelectedOption] = useState('firstPage');
    const [auction, setAuction] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const {reviewRating, sizes, feedbacks} = placementsValue ?? {};
    const price = Math.round((sizes?.[0]?.price?.total ?? 0) / 100);

    useEffect(() => {
        if (!open) setAuction([]);
        else {
            getAuction();
            setAuctionSelectedOption('firstPage');
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
    }, [sellerId, phrase, auctionSelectedOption, open]);

    const graphData = useMemo<GraphData | null>(() => {
        if (!auction.length) return null;

        const pricesData: number[] = [];
        const pricesDataCur: (number | null)[] = [];
        const reviewRatingsData: number[] = [];
        const reviewRatingsDataCur: (number | null)[] = [];
        const feedbacksData: number[] = [];
        const feedbacksDataCur: (number | null)[] = [];

        auction.forEach((card) => {
            const {reviewRating: cardRating, sizes: cardSizes, feedbacks: cardFeedbacks} = card;
            const priceRub = Math.round((cardSizes?.[0]?.['price']?.['total'] ?? 0) / 100);

            if (!pricesData.includes(priceRub)) pricesData.push(priceRub);
            if (!reviewRatingsData.includes(cardRating)) reviewRatingsData.push(cardRating);
            if (!feedbacksData.includes(cardFeedbacks)) feedbacksData.push(cardFeedbacks);
        });

        if (!pricesData.includes(price)) pricesData.push(price);
        if (!reviewRatingsData.includes(reviewRating)) reviewRatingsData.push(reviewRating);
        if (!feedbacksData.includes(feedbacks)) feedbacksData.push(feedbacks);

        pricesData.sort((a, b) => a - b);
        reviewRatingsData.sort((a, b) => a - b);
        feedbacksData.sort((a, b) => a - b);

        pricesData.forEach((val) => {
            pricesDataCur.push(val === price ? price : null);
        });

        reviewRatingsData.forEach((val) => {
            reviewRatingsDataCur.push(val === reviewRating ? reviewRating : null);
        });

        feedbacksData.forEach((val) => {
            feedbacksDataCur.push(val === feedbacks ? feedbacks : null);
        });

        return {
            prices: {
                labels: pricesData.map((val) => val.toString()),
                datasets: [
                    {
                        label: 'Топ 100 артикулов',
                        data: pricesData,
                        backgroundColor: '#5fb8a5',
                    },
                    {
                        label: 'Этот артикул',
                        data: pricesDataCur,
                        backgroundColor: '#ffbe5c',
                    },
                ],
            },
            rating: {
                labels: reviewRatingsData.map((val) => val.toString()),
                datasets: [
                    {
                        label: 'Топ 100 артикулов',
                        data: reviewRatingsData,
                        backgroundColor: '#9a63d1',
                    },
                    {
                        label: 'Этот артикул',
                        data: reviewRatingsDataCur,
                        backgroundColor: '#ffbe5c',
                    },
                ],
            },
            feedbacks: {
                labels: feedbacksData.map((val) => val.toString()),
                datasets: [
                    {
                        label: 'Топ 100 артикулов',
                        data: feedbacksData,
                        backgroundColor: '#4aa1f2',
                    },
                    {
                        label: 'Этот артикул',
                        data: feedbacksDataCur,
                        backgroundColor: '#ffbe5c',
                    },
                ],
            },
        };
    }, [auction, price, reviewRating, feedbacks]);

    let pieChartData = null;
    if (auction.length && reviewRating) {
        pieChartData = convertToChartPie(auction, reviewRating);
    }

    if (!price) return null;

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Popover
                onOpenChange={setOpen}
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
                                    padding: '16px',
                                }}
                            >
                                <div style={{height: '60%', marginBottom: '16px'}}>
                                    {graphData?.prices && (
                                        <BarChartComponent
                                            data={graphData.prices as any}
                                            title="Цены топ 100 артикулов по запросу"
                                            yAxisLabel="Цены"
                                        />
                                    )}
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '100%',
                                        height: '40%',
                                        gap: '16px',
                                    }}
                                >
                                    <div style={{width: '30%'}}>
                                        {pieChartData && (
                                            <PieChart
                                                initialLabel={''}
                                                title="Рейтинг топ 100 артикулов по запросу"
                                                plainData={pieChartData.plainData}
                                                labels={pieChartData.labels}
                                                backgroundColor={pieChartData.backgroundColor}
                                                borderColor={pieChartData.borderColor}
                                            />
                                        )}
                                    </div>
                                    <div style={{width: '70%'}}>
                                        {graphData?.feedbacks && (
                                            <BarChartComponent
                                                data={graphData.feedbacks as any}
                                                title="Количество отзывов топ 100 артикулов по запросу"
                                                yAxisLabel="Отзывы"
                                            />
                                        )}
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
    );
};
