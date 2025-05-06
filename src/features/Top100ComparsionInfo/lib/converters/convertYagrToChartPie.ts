const SELECTED_ELEMENT_COLOR: string = '#ffbe5c';

type ChartPieFormat = {
    plainData: number[];
    backgroundColor: string[];
    labels: string[];
    borderColor: string[];
};

export const convertYagrToChartPie = (auctionData: any[]): ChartPieFormat => {
    const ratingCounts: Record<number, number> = {};

    auctionData.forEach((item) => {
        const rating = item.reviewRating;
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });

    const currentRating = auctionData[0]?.reviewRating;
    const currentCount = 1;

    const allRatings = Object.keys(ratingCounts).map(Number).sort();
    const plainData: number[] = [];
    const labels: string[] = [];
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];

    allRatings.forEach((rating) => {
        const count =
            rating === currentRating
                ? currentCount + (ratingCounts[rating] || 0) - 1
                : ratingCounts[rating];

        plainData.push(count);
        labels.push(rating === currentRating ? `Этот артикул (${rating})` : `Рейтинг ${rating}`);

        if (rating === currentRating) {
            backgroundColor.push(SELECTED_ELEMENT_COLOR);
            borderColor.push('#000');
        } else {
            backgroundColor.push('#9a63d1');
            borderColor.push('#000');
        }
    });

    return {
        plainData,
        labels,
        backgroundColor,
        borderColor,
    };
};
