// import DataTable, {Column} from '@gravity-ui/react-data-table';
// import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
// import React, {useState} from 'react';
// import useWindowDimensions from 'src/hooks/useWindowDimensions';
// import block from 'bem-cn-lite';
// import {TextInput} from '@gravity-ui/uikit';

// const b = block('the-table');

// export default function TheTable(columnData: any[]) {
//     const [filters, setFilters] = useState({undef: false});
//     const [filteredSummary, setFilteredSummary] = useState({undef: false});

//     const generateColumns = (columnsInfo) => {
//         const columns: Column<any>[] = [
//             // {
//             //     sortable: false,
//             //     name: 'selected',
//             //     header: (
//             //         // <Checkbox
//             //         //     style={{marginTop: 5}}
//             //         //     value={Number(selectAllDisplayed)}
//             //         //     onUpdate={(checked) => {
//             //         //         setSelectAllDisplayed(checked);
//             //         //     }}
//             //         //     size="l"
//             //         // />
//             //     ),
//             //     render: ({value}) => {
//             //         if (!value) return;
//             //         const {val, disabled} = value as {val: boolean; disabled: boolean};
//             //         if (disabled) return;
//             //         return <Checkbox>{val}</Checkbox>;
//             //     },
//             // },
//         ];
//         if (!columnsInfo && !columnsInfo.length) return columns;
//         const viewportSize = useWindowDimensions();
//         for (let i = 0; i < columnsInfo.length; i++) {
//             const column = columnsInfo[i];
//             if (!column) continue;
//             const {name, placeholder, width, render, className, valueType} = column;
//             let minWidth = viewportSize.width / 20;
//             if (minWidth < 40) minWidth = 60;
//             if (minWidth > 100) minWidth = 100;
//             columns.push({
//                 name: name,
//                 className: b(className ?? (i == 0 ? 'td_fixed' : 'td_body')),
//                 header: (
//                     <div
//                         title={placeholder}
//                         style={{
//                             minWidth: width ? (minWidth < width ? minWidth : width) : minWidth,
//                             display: 'flex',
//                             maxWidth: '30vw',
//                             // marginLeft:
//                             //     name == 'art' ? `${String(data.length).length * 6 + 32}px` : 0,
//                         }}
//                         onClick={(event) => {
//                             event.stopPropagation();
//                         }}
//                     >
//                         <TextInput
//                             onChange={(val) => {
//                                 setFilters(() => {
//                                     if (!(name in filters))
//                                         filters[name] = {compMode: 'include', val: ''};
//                                     filters[name].val = val.target.value;
//                                     recalc(dateRange, '', filters);
//                                     return filters;
//                                 });
//                             }}
//                             hasClear
//                             placeholder={placeholder}
//                             rightContent={
//                                 <DropdownMenu
//                                     renderSwitcher={(props) => (
//                                         <Button
//                                             {...props}
//                                             view={
//                                                 filters[name]
//                                                     ? filters[name].val != ''
//                                                         ? !filters[name].compMode.includes('not')
//                                                             ? 'flat-success'
//                                                             : 'flat-danger'
//                                                         : 'flat'
//                                                     : 'flat'
//                                             }
//                                             size="xs"
//                                         >
//                                             <Icon data={Funnel} />
//                                         </Button>
//                                     )}
//                                     items={[
//                                         [
//                                             {
//                                                 iconStart: (
//                                                     <Icon
//                                                         data={
//                                                             filters[name]
//                                                                 ? filters[name].compMode ==
//                                                                   'include'
//                                                                     ? CirclePlusFill
//                                                                     : CirclePlus
//                                                                 : CirclePlusFill
//                                                         }
//                                                     />
//                                                 ),
//                                                 action: () => {
//                                                     setFilters(() => {
//                                                         if (!(name in filters))
//                                                             filters[name] = {
//                                                                 compMode: 'include',
//                                                                 val: '',
//                                                             };
//                                                         filters[name].compMode = 'include';
//                                                         recalc(dateRange, '', filters);
//                                                         return filters;
//                                                     });
//                                                 },
//                                                 text: 'Включает',
//                                             },
//                                             {
//                                                 iconStart: (
//                                                     <Icon
//                                                         data={
//                                                             filters[name]
//                                                                 ? filters[name].compMode ==
//                                                                   'not include'
//                                                                     ? CircleMinusFill
//                                                                     : CircleMinus
//                                                                 : CircleMinus
//                                                         }
//                                                     />
//                                                 ),
//                                                 action: () => {
//                                                     setFilters(() => {
//                                                         if (!(name in filters))
//                                                             filters[name] = {
//                                                                 compMode: 'not include',
//                                                                 val: '',
//                                                             };
//                                                         filters[name].compMode = 'not include';
//                                                         recalc(dateRange, '', filters);
//                                                         return filters;
//                                                     });
//                                                 },
//                                                 text: 'Не включает',
//                                                 theme: 'danger',
//                                             },
//                                         ],
//                                         [
//                                             {
//                                                 iconStart: (
//                                                     <Icon
//                                                         data={
//                                                             filters[name]
//                                                                 ? filters[name].compMode == 'equal'
//                                                                     ? CirclePlusFill
//                                                                     : CirclePlus
//                                                                 : CirclePlus
//                                                         }
//                                                     />
//                                                 ),
//                                                 action: () => {
//                                                     setFilters(() => {
//                                                         if (!(name in filters))
//                                                             filters[name] = {
//                                                                 compMode: 'equal',
//                                                                 val: '',
//                                                             };
//                                                         filters[name].compMode = 'equal';
//                                                         recalc(dateRange, '', filters);
//                                                         return filters;
//                                                     });
//                                                 },
//                                                 text: 'Равно',
//                                             },
//                                             {
//                                                 iconStart: (
//                                                     <Icon
//                                                         data={
//                                                             filters[name]
//                                                                 ? filters[name].compMode ==
//                                                                   'not equal'
//                                                                     ? CircleMinusFill
//                                                                     : CircleMinus
//                                                                 : CircleMinus
//                                                         }
//                                                     />
//                                                 ),
//                                                 action: () => {
//                                                     setFilters(() => {
//                                                         if (!(name in filters))
//                                                             filters[name] = {
//                                                                 compMode: 'not equal',
//                                                                 val: '',
//                                                             };
//                                                         filters[name].compMode = 'not equal';
//                                                         recalc(dateRange, '', filters);
//                                                         return filters;
//                                                     });
//                                                 },
//                                                 text: 'Не равно',
//                                                 theme: 'danger',
//                                             },
//                                         ],
//                                         valueType != 'text'
//                                             ? [
//                                                   {
//                                                       iconStart: (
//                                                           <Icon
//                                                               data={
//                                                                   filters[name]
//                                                                       ? filters[name].compMode ==
//                                                                         'bigger'
//                                                                           ? CirclePlusFill
//                                                                           : CirclePlus
//                                                                       : CirclePlus
//                                                               }
//                                                           />
//                                                       ),
//                                                       action: () => {
//                                                           setFilters(() => {
//                                                               if (!(name in filters))
//                                                                   filters[name] = {
//                                                                       compMode: 'bigger',
//                                                                       val: '',
//                                                                   };
//                                                               filters[name].compMode = 'bigger';
//                                                               recalc(dateRange, '', filters);
//                                                               return filters;
//                                                           });
//                                                       },
//                                                       text: 'Больше',
//                                                   },
//                                                   {
//                                                       iconStart: (
//                                                           <Icon
//                                                               data={
//                                                                   filters[name]
//                                                                       ? filters[name].compMode ==
//                                                                         'not bigger'
//                                                                           ? CircleMinusFill
//                                                                           : CircleMinus
//                                                                       : CircleMinus
//                                                               }
//                                                           />
//                                                       ),
//                                                       action: () => {
//                                                           setFilters(() => {
//                                                               if (!(name in filters))
//                                                                   filters[name] = {
//                                                                       compMode: 'not bigger',
//                                                                       val: '',
//                                                                   };
//                                                               filters[name].compMode = 'not bigger';
//                                                               recalc(dateRange, '', filters);
//                                                               return filters;
//                                                           });
//                                                       },
//                                                       text: 'Меньше',
//                                                       theme: 'danger',
//                                                   },
//                                               ]
//                                             : [],
//                                     ]}
//                                 />
//                             }
//                         />
//                     </div>
//                 ),
//                 render: render
//                     ? (args) => render(args)
//                     : ({value}) => {
//                           return typeof value === 'number'
//                               ? new Intl.NumberFormat('ru-RU').format(value)
//                               : value;
//                       },
//             });
//         }

//         return columns;
//     };

//     const recalc = (daterng, selected = '', withfFilters = {}) => {
//         const getRoundValue = (a, b, isPercentage = false, def = 0) => {
//             let result = b ? a / b : def;
//             if (isPercentage) {
//                 result = Math.round(result * 100 * 100) / 100;
//             } else {
//                 result = Math.round(result);
//             }
//             return result;
//         };

//         const [startDate, endDate] = daterng;
//         startDate.setHours(0);
//         startDate.setMinutes(0);
//         startDate.setSeconds(0);
//         endDate.setHours(0);
//         endDate.setMinutes(0);
//         endDate.setSeconds(0);

//         const summaryTemp = {
//             views: 0,
//             clicks: 0,
//             sum: 0,
//             ctr: 0,
//             drr: 0,
//             orders: 0,
//             sum_orders: 0,
//         };

//         const campaignData = document
//             ? document.campaigns
//                 ? document.campaigns[selected == '' ? selectValue[0] : selected]
//                 : {}
//             : {};
//         const temp: any[] = [];
//         for (const [art, artData] of Object.entries(campaignData)) {
//             if (!art || !artData) continue;
//             const artInfo = {
//                 art: '',
//                 object: '',
//                 nmId: 0,
//                 title: '',
//                 stocks: 0,
//                 adverts: 0,
//                 semantics: undefined,
//                 budget: undefined,
//                 bid: undefined,
//                 budgetToKeep: undefined,
//                 brand: '',
//                 orders: 0,
//                 sum_orders: 0,
//                 sum: 0,
//                 views: 0,
//                 clicks: 0,
//                 drr: 0,
//                 ctr: 0,
//                 cpc: 0,
//                 cpm: 0,
//                 cr: 0,
//                 cpo: 0,
//                 cpoAI: 0,
//             };
//             artInfo.art = artData['art'];
//             artInfo.object = artData['object'];
//             artInfo.nmId = artData['nmId'];
//             artInfo.title = artData['title'];
//             artInfo.brand = artData['brand'];
//             artInfo.stocks = artData['stocks'];
//             artInfo.adverts = artData['adverts'];
//             artInfo.budgetToKeep = artData['budgetToKeep'];
//             artInfo.cpoAI = artData['cpoAI'];

//             if (artInfo.adverts) {
//                 for (const [advertType, advertsOfType] of Object.entries(artInfo.adverts)) {
//                     if (!advertType || !advertsOfType) continue;

//                     for (const [advertId, advertData] of Object.entries(advertsOfType)) {
//                         if (!advertId || !advertData) continue;
//                         const status = advertData['status'];
//                         if (![4, 9, 11].includes(status)) continue;
//                         const budget = advertData['budget'];
//                         artInfo.budget = budget;
//                         artInfo.semantics = advertData['words'];
//                         artInfo.bid = advertData['cpm'];
//                     }
//                 }
//             }
//             if (artData['advertsStats']) {
//                 for (const [strDate, day] of Object.entries(artData['advertsStats'])) {
//                     if (strDate == 'updateTime') continue;
//                     if (!day) continue;
//                     const date = new Date(strDate);
//                     date.setHours(0);
//                     date.setMinutes(0);
//                     date.setSeconds(0);
//                     if (date < startDate || date > endDate) continue;

//                     artInfo.sum_orders += day['sum_orders'];
//                     artInfo.orders += day['orders'];
//                     artInfo.sum += day['sum'];
//                     artInfo.views += day['views'];
//                     artInfo.clicks += day['clicks'];
//                 }
//                 artInfo.sum_orders = Math.round(artInfo.sum_orders);
//                 artInfo.orders = Math.round(artInfo.orders);
//                 artInfo.sum = Math.round(artInfo.sum);
//                 artInfo.views = Math.round(artInfo.views);
//                 artInfo.clicks = Math.round(artInfo.clicks);

//                 artInfo.drr = getRoundValue(artInfo.sum, artInfo.sum_orders, true, 1);
//                 artInfo.ctr = getRoundValue(artInfo.clicks, artInfo.views, true);
//                 artInfo.cpc = getRoundValue(artInfo.sum, artInfo.clicks);
//                 artInfo.cpm = getRoundValue(artInfo.sum * 1000, artInfo.views);
//                 artInfo.cr = getRoundValue(artInfo.orders, artInfo.views, true);
//                 artInfo.cpo = getRoundValue(artInfo.sum, artInfo.orders, false, artInfo.sum);

//                 summaryTemp.sum_orders += artInfo.sum_orders;
//                 summaryTemp.orders += artInfo.orders;
//                 summaryTemp.sum += artInfo.sum;
//                 summaryTemp.views += artInfo.views;
//                 summaryTemp.clicks += artInfo.clicks;
//                 summaryTemp.drr = getRoundValue(summaryTemp.sum, summaryTemp.sum_orders, true, 1);
//             }

//             const compare = (a, filterData) => {
//                 const {val, compMode} = filterData;
//                 if (compMode == 'include') {
//                     return String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
//                 }
//                 if (compMode == 'not include') {
//                     return !String(a).toLocaleLowerCase().includes(String(val).toLocaleLowerCase());
//                 }
//                 if (compMode == 'equal') {
//                     return String(a).toLocaleLowerCase() == String(val).toLocaleLowerCase();
//                 }
//                 if (compMode == 'not equal') {
//                     return String(a).toLocaleLowerCase() != String(val).toLocaleLowerCase();
//                 }
//                 if (compMode == 'bigger') {
//                     return Number(a) > Number(val);
//                 }
//                 if (compMode == 'not bigger') {
//                     return Number(a) < Number(val);
//                 }
//                 return false;
//             };

//             let addFlag = true;
//             const useFilters = withfFilters['undef'] ? withfFilters : filters;
//             for (const [filterArg, filterData] of Object.entries(useFilters)) {
//                 if (filterArg == 'undef' || !filterData) continue;
//                 if (filterData['val'] == '') continue;
//                 // if (filterArg == 'adverts') {}
//                 if (!compare(artInfo[filterArg], filterData)) {
//                     addFlag = false;
//                     break;
//                 }
//             }
//             if (addFlag) temp.push(artInfo);

//             // data.push(advertStats);
//         }

//         setSummary(summaryTemp);

//         // console.log(temp);
//         const filteredSummaryTemp = {
//             art: `Показано артикулов: ${temp.length}`,
//             orders: 0,
//             sum_orders: 0,
//             sum: 0,
//             views: 0,
//             clicks: 0,
//             drr: 0,
//             ctr: 0,
//             cpc: 0,
//             cpm: 0,
//             cr: 0,
//             cpo: 0,
//             adverts: null,
//             semantics: null,
//             budget: 0,
//             budgetToKeep: 0,
//         };
//         for (let i = 0; i < temp.length; i++) {
//             const row = temp[i];
//             filteredSummaryTemp.sum_orders += row['sum_orders'];
//             filteredSummaryTemp.orders += row['orders'];
//             filteredSummaryTemp.sum += row['sum'];
//             filteredSummaryTemp.views += row['views'];
//             filteredSummaryTemp.clicks += row['clicks'];
//             filteredSummaryTemp.budget += row['budget'] ?? 0;
//             filteredSummaryTemp.budgetToKeep += row['budgetToKeep'] ?? 0;
//         }
//         filteredSummaryTemp.sum_orders = Math.round(filteredSummaryTemp.sum_orders);
//         filteredSummaryTemp.orders = Math.round(filteredSummaryTemp.orders);
//         filteredSummaryTemp.sum = Math.round(filteredSummaryTemp.sum);
//         filteredSummaryTemp.views = Math.round(filteredSummaryTemp.views);
//         filteredSummaryTemp.clicks = Math.round(filteredSummaryTemp.clicks);
//         filteredSummaryTemp.budget = Math.round(filteredSummaryTemp.budget);
//         filteredSummaryTemp.budgetToKeep = Math.round(filteredSummaryTemp.budgetToKeep);

//         filteredSummaryTemp.drr = getRoundValue(
//             filteredSummaryTemp.sum,
//             filteredSummaryTemp.sum_orders,
//             true,
//             1,
//         );
//         filteredSummaryTemp.ctr = getRoundValue(
//             filteredSummaryTemp.clicks,
//             filteredSummaryTemp.views,
//             true,
//         );
//         filteredSummaryTemp.cpc = getRoundValue(
//             filteredSummaryTemp.sum,
//             filteredSummaryTemp.clicks,
//         );
//         filteredSummaryTemp.cpm = getRoundValue(
//             filteredSummaryTemp.sum * 1000,
//             filteredSummaryTemp.views,
//         );
//         filteredSummaryTemp.cr = getRoundValue(
//             filteredSummaryTemp.orders,
//             filteredSummaryTemp.views,
//             true,
//         );
//         filteredSummaryTemp.cpo = getRoundValue(
//             filteredSummaryTemp.sum,
//             filteredSummaryTemp.orders,
//             false,
//             filteredSummaryTemp.sum,
//         );
//         setFilteredSummary(filteredSummaryTemp);
//         // if (!temp.length) temp.push({});
//         temp.sort((a, b) => a.art.localeCompare(b.art));
//         setTableData(temp);
//     };

//     const columns = generateColumns(columnData);

//     return (
//         <div
//             style={{
//                 width: '100%',
//                 maxHeight: '60vh',
//                 overflow: 'auto',
//             }}
//         >
//             <DataTable
//                 startIndex={1}
//                 settings={{
//                     stickyHead: MOVING,
//                     stickyFooter: MOVING,
//                     displayIndices: false,
//                     highlightRows: true,
//                 }}
//                 theme="yandex-cloud"
//                 onRowClick={(row, index, event) => {
//                     console.log(row, index, event);
//                 }}
//                 // rowClassName={(_row, index) => b('tableRow_' + index)}
//                 // defaultSortState={sort}
//                 // sortState={sort}
//                 // onSortStateChange={(state) => setSort(state)}
//                 // className={b('tableStats')}
//                 data={data}
//                 columns={columns}
//                 footerData={[filteredSummary]}
//             />
//         </div>
//     );
// }
