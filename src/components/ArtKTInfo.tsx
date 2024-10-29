// import {Button, Text, Icon} from '@gravity-ui/uikit';
// import {Comment, Star} from '@gravity-ui/icons';
// import React, {useEffect, useState} from 'react';
// import {ChartModal} from './ChartModal';
// import {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

// export const ArtKTInfo = ({nmIdKTInfos, nmId}) => {
//     const [priceRub, setPriceRub] = useState(0);
//     const [reviewRating, setReviewRating] = useState(0);
//     const [feedbacks, setFeedbacks] = useState(0);

//     useEffect(() => {
//         if (!nmIdKTInfos || !nmId) return;

//         const temp = nmIdKTInfos[nmId] ?? {};
//         setPriceRub(temp?.priceRub);
//         setReviewRating(temp?.reviewRating);
//         setFeedbacks(temp?.feedbacks);

//         const timeline: any[] = [];
//         const pricesData: any[] = [];
//         const pricesDataCur: any[] = [];
//         const reviewRatingsData: any[] = [];
//         const reviewRatingsDataCur: any[] = [];
//         const feedbacksData: any[] = [];
//         const feedbacksDataCur: any[] = [];
//         let yagrPricesData = {} as any;
//         let yagrReviewRatingsData = {} as any;
//         let yagrFeedbacksData = {} as any;

//         if (placementsValue && reviewRating) {
//             if (firstPage) {
//                 for (let i = 0; i < firstPage.length; i++) {
//                     timeline.push(i);
//                     const card = firstPage[i];
//                     // console.log(card);

//                     const {reviewRating, sizes, feedbacks} = card;
//                     const {price} = sizes ? sizes[0] ?? {price: undefined} : {price: undefined};
//                     const {total} = price ?? {total: 0};
//                     const priceRub = Math.round(total / 100);

//                     pricesData.push(priceRub);
//                     reviewRatingsData.push(reviewRating);
//                     feedbacksData.push(feedbacks);
//                 }
//             }
//             pricesData.sort((a, b) => a - b);
//             for (let i = 0; i < pricesData.length; i++) {
//                 if (pricesData[i] == priceRub) {
//                     pricesDataCur.push(priceRub);
//                     break;
//                 } else {
//                     pricesDataCur.push(null);
//                 }
//             }
//             reviewRatingsData.sort((a, b) => a - b);
//             for (let i = 0; i < reviewRatingsData.length; i++) {
//                 if (reviewRatingsData[i] == reviewRating) {
//                     reviewRatingsDataCur.push(reviewRating);
//                     break;
//                 } else {
//                     reviewRatingsDataCur.push(null);
//                 }
//             }
//             feedbacksData.sort((a, b) => a - b);
//             for (let i = 0; i < feedbacksData.length; i++) {
//                 if (feedbacksData[i] == feedbacks) {
//                     feedbacksDataCur.push(feedbacks);
//                     break;
//                 } else {
//                     feedbacksDataCur.push(null);
//                 }
//             }
//         }
//     }, [nmIdKTInfos, nmId]);

//     const genYagrData = (
//         all,
//         cur,
//         colorAll,
//         title,
//         axisName,
//         cursorName,
//         min = -1,
//         colorCur = '#ffbe5c',
//     ) => {
//         return {
//             data: {
//                 timeline: timeline,
//                 graphs: [
//                     {
//                         color: colorCur,
//                         type: 'column',
//                         data: cur,
//                         id: '1',
//                         name: 'Этот артикул',
//                         scale: 'y',
//                     },
//                     {
//                         id: '0',
//                         name: cursorName,
//                         data: all,
//                         color: colorAll,
//                         scale: 'y',
//                     },
//                 ],
//             },

//             libraryConfig: {
//                 chart: {
//                     series: {
//                         type: 'column',
//                     },
//                 },
//                 axes: {
//                     y: {
//                         label: axisName,
//                         precision: 'auto',
//                         show: true,
//                     },
//                     x: {
//                         show: true,
//                     },
//                 },
//                 series: [],
//                 scales: {
//                     y: {
//                         min: min == -1 ? Math.floor(all[0]) : min,
//                     },
//                 },
//                 title: {
//                     text: title,
//                 },
//             },
//         } as YagrWidgetData;
//     };

//     return (
//         <div style={{display: 'flex', flexDirection: 'column'}}>
//             <ChartModal
//                 fetchingFunction={() => {
//                     return new Promise((resolve) => {
//                         const timelineBudget: any[] = [];
//                         const graphsDataBudgets: any[] = [];
//                         const graphsDataBudgetsDiv: any[] = [];
//                         const graphsDataBudgetsDivHours = {};
//                         if (budgetLog) {
//                             for (let i = 0; i < budgetLog.length; i++) {
//                                 const {budget, time} = budgetLog[i];
//                                 if (!time || !budget) continue;

//                                 const timeObj = new Date(time);

//                                 timeObj.setMinutes(Math.floor(timeObj.getMinutes() / 15) * 15);

//                                 const lbd = new Date(dateRange[0]);
//                                 lbd.setHours(0, 0, 0, 0);
//                                 const rbd = new Date(dateRange[1]);
//                                 rbd.setHours(23, 59, 59);
//                                 if (timeObj < lbd || timeObj > rbd) continue;
//                                 timelineBudget.push(timeObj.getTime());
//                                 graphsDataBudgets.push(budget);

//                                 const hour = time.slice(0, 13);
//                                 if (!graphsDataBudgetsDivHours[hour])
//                                     graphsDataBudgetsDivHours[hour] = budget;
//                             }
//                             let prevHour = '';
//                             for (let i = 0; i < timelineBudget.length; i++) {
//                                 const dateObj = new Date(timelineBudget[i]);
//                                 const time = dateObj.toISOString();
//                                 if (dateObj.getMinutes() != 0) {
//                                     graphsDataBudgetsDiv.push(null);
//                                     continue;
//                                 }
//                                 const hour = time.slice(0, 13);
//                                 if (prevHour == '') {
//                                     graphsDataBudgetsDiv.push(null);
//                                     prevHour = hour;
//                                     continue;
//                                 }

//                                 const spent =
//                                     graphsDataBudgetsDivHours[prevHour] -
//                                     graphsDataBudgetsDivHours[hour];
//                                 graphsDataBudgetsDiv.push(spent);

//                                 prevHour = hour;
//                             }
//                         }

//                         const yagrBudgetData = {
//                             data: {
//                                 timeline: timelineBudget,
//                                 graphs: [
//                                     {
//                                         id: '0',
//                                         name: 'Баланс',
//                                         scale: 'y',
//                                         color: '#ffbe5c',
//                                         data: graphsDataBudgets,
//                                     },
//                                     {
//                                         id: '1',
//                                         type: 'column',
//                                         data: graphsDataBudgetsDiv,
//                                         name: 'Расход',
//                                         scale: 'r',
//                                     },
//                                 ],
//                             },

//                             libraryConfig: {
//                                 chart: {
//                                     series: {
//                                         spanGaps: false,
//                                         type: 'line',
//                                         interpolation: 'smooth',
//                                     },
//                                 },
//                                 axes: {
//                                     y: {
//                                         label: 'Баланс',
//                                         precision: 'auto',
//                                         show: true,
//                                     },
//                                     r: {
//                                         label: 'Расход',
//                                         precision: 'auto',
//                                         side: 'right',
//                                         show: true,
//                                     },
//                                     x: {
//                                         label: 'Время',
//                                         precision: 'auto',
//                                         show: true,
//                                     },
//                                 },
//                                 scales: {y: {min: 0}, r: {min: 0}},
//                                 title: {
//                                     text: 'Изменение баланса',
//                                 },
//                             },
//                         } as YagrWidgetData;

//                         resolve(yagrBudgetData);
//                         return yagrBudgetData;
//                     });
//                 }}
//             >
//                 <Button
//                     view="flat"
//                     width="max"
//                     size="xs"
//                     pin="clear-clear"
//                     style={{
//                         width: 120,
//                         overflow: 'hidden',
//                         borderTopLeftRadius: 7,
//                         borderTopRightRadius: 7,
//                     }}
//                     // pin="brick-brick"
//                 >
//                     {`${priceRub} ₽`}
//                 </Button>
//             </ChartModal>
//             <div style={{display: 'flex', flexDirection: 'row'}}>
//                 <Button
//                     width="max"
//                     size="xs"
//                     view="flat"
//                     pin="clear-clear"
//                     style={{
//                         width: 60,
//                     }}
//                 >
//                     <div
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                         }}
//                     >
//                         <Text>{reviewRating}</Text>
//                         <div style={{minWidth: 3}} />
//                         <Text color="warning" style={{display: 'flex', alignItems: 'center'}}>
//                             <Icon data={Star} size={11} />
//                         </Text>
//                     </div>
//                 </Button>
//                 <div
//                     style={{
//                         background: 'var(--yc-color-base-generic-hover)',
//                         height: 20,
//                         minWidth: 0.5,
//                     }}
//                 />
//                 <Button
//                     style={{
//                         width: 60,
//                         overflow: 'hidden',
//                     }}
//                     width="max"
//                     size="xs"
//                     view="flat"
//                     pin="clear-clear"
//                 >
//                     <div
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                         }}
//                     >
//                         <Text>{feedbacks}</Text>
//                         <div style={{minWidth: 3}} />
//                         <Icon data={Comment} size={11} />
//                     </div>
//                 </Button>
//             </div>
//         </div>
//     );
// };
