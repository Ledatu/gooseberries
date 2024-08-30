// import {Button, Icon, Modal, Select, Text, List} from '@gravity-ui/uikit';
// import React, {useEffect, useMemo, useState} from 'react';
// import {TrashBin, ChevronDown, Key} from '@gravity-ui/icons';
// import {motion} from 'framer-motion';
// import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';

// export const ManageDeletionOfOldPlansModal = ({
//     selectValue,
//     doc,
//     setChangedDoc,
//     columnDataReversed,
//     colors,
//     dateRange,
// }: {
//     selectValue: string[];
//     doc: object;
//     setChangedDoc: Function;
//     columnDataReversed: object;
//     colors: string[];
//     dateRange: Date[];
// }) => {
//     const [open, setOpen] = useState(false);
//     const [currentStep, setCurrentStep] = useState(0);
//     const [currenrPlanModalMetrics, setCurrenrPlanModalMetrics] = useState([] as any[]);
//     const [selectedButton, setSelectedButton] = useState('');

//     const [selectedCampaignForUpload, setSelectedCampaignForUpload] = useState(selectValue);
//     useEffect(() => {
//         setSelectedCampaignForUpload(selectValue);
//     }, [selectValue]);

//     const selectOptions = useMemo(() => {
//         const getMonth = (inputDate) => {
//             const date = new Date(inputDate);
//             let str = date.toLocaleString('ru-RU', {
//                 month: 'long',
//             });
//             const year = date.getFullYear();
//             // Capitalize the first letter
//             str = `${str.charAt(0).toUpperCase() + str.slice(1)} ${year}`;
//             return str;
//         };

//         //   for (const )
//     }, [dateRange]);

//     useEffect(() => {
//         setCurrentStep(0);
//     }, [open]);

//     return (
//         <div style={{display: 'flex', flexDirection: 'row'}}>
//             <Button
//                 size="l"
//                 onClick={() => {
//                     setOpen(true);
//                 }}
//             >
//                 <Icon data={TrashBin} />
//             </Button>
//             <Modal
//                 open={open}
//                 onClose={() => {
//                     setOpen(false);
//                 }}
//             >
//                 <motion.div
//                     style={{
//                         width: 300,
//                         margin: 20,
//                         flexWrap: 'nowrap',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         backgroundColor: 'none',
//                     }}
//                 >
//                     <motion.div
//                         animate={{height: currentStep == 1 ? 48 : 0}}
//                         style={{
//                             overflow: 'hidden',
//                             height: 0,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             justifyContent: 'end',
//                             width: '100%',
//                         }}
//                     >
//                         <Select
//                             size="l"
//                             width="max"
//                             options={selectOptions}
//                             value={selectedCampaignForUpload}
//                             onUpdate={(opt) => {
//                                 setSelectedCampaignForUpload(opt);
//                             }}
//                             renderControl={({onClick, onKeyDown, ref}) => {
//                                 return (
//                                     <Button
//                                         width="max"
//                                         view="outlined"
//                                         ref={ref}
//                                         size="l"
//                                         onClick={onClick}
//                                         extraProps={{
//                                             onKeyDown,
//                                         }}
//                                     >
//                                         <Icon data={Key} />
//                                         {selectedCampaignForUpload[0]}
//                                         <Icon data={ChevronDown} />
//                                     </Button>
//                                 );
//                             }}
//                         />
//                     </motion.div>
//                     <motion.div
//                         animate={{maxHeight: currentStep > 0 ? 450 : 0}}
//                         style={{
//                             maxHeight: 0,
//                             overflow: 'hidden',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             justifyContent: 'end',
//                             alignItems: 'center',
//                             width: '100%',
//                         }}
//                     >
//                         <List
//                             filterPlaceholder="Введите название метрики"
//                             emptyPlaceholder="Такая метрика отсутствует"
//                             items={Object.keys(columnDataReversed)}
//                             renderItem={(item) => {
//                                 const selected = currenrPlanModalMetrics.includes(
//                                     columnDataReversed[item],
//                                 );

//                                 const graphColor = colors[0];
//                                 const backColor = graphColor
//                                     ? graphColor.slice(0, graphColor.length - 10) + '150)'
//                                     : undefined;
//                                 const graphTrendColor = graphColor
//                                     ? graphColor.slice(0, graphColor.length - 10) + '650-solid)'
//                                     : undefined;

//                                 return (
//                                     <Button
//                                         size="xs"
//                                         pin="circle-circle"
//                                         // selected={selected}
//                                         style={{position: 'relative', overflow: 'hidden'}}
//                                         view={selected ? 'flat' : 'outlined'}
//                                     >
//                                         <div
//                                             style={{
//                                                 borderRadius: 10,
//                                                 left: 0,
//                                                 position: 'absolute',
//                                                 width: '100%',
//                                                 height: '100%',
//                                                 background: selected ? backColor : '#0000',
//                                             }}
//                                         />
//                                         <Text
//                                             style={{
//                                                 color: selected ? graphTrendColor : undefined,
//                                             }}
//                                         >
//                                             {item}
//                                         </Text>
//                                     </Button>
//                                 );
//                             }}
//                             onItemClick={(item) => {
//                                 const metricVal = columnDataReversed[item];
//                                 let tempArr = Array.from(currenrPlanModalMetrics);
//                                 if (tempArr.includes(metricVal)) {
//                                     tempArr = tempArr.filter((value) => value != metricVal);
//                                 } else {
//                                     tempArr.push(metricVal);
//                                 }

//                                 setCurrenrPlanModalMetrics(tempArr);
//                             }}
//                         />
//                         <Button
//                             width="max"
//                             view={currenrPlanModalMetrics.length ? 'flat-danger' : 'normal'}
//                             selected={currenrPlanModalMetrics.length != 0}
//                             onClick={() => {
//                                 setCurrenrPlanModalMetrics([]);
//                             }}
//                         >
//                             <div
//                                 style={{
//                                     width: '100%',
//                                     display: 'flex',
//                                     flexDirection: 'row',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                 }}
//                             >
//                                 <Icon data={TrashBin} />
//                                 <div style={{minWidth: 3}} />
//                                 Очистить
//                             </div>
//                         </Button>
//                     </motion.div>
//                     <motion.div
//                         animate={{height: currentStep < 3 ? 36 : 0}}
//                         style={{height: 36, overflow: 'hidden', width: '100%'}}
//                     >
//                         {generateModalButtonWithActions(
//                             {
//                                 disabled: !currenrPlanModalMetrics.length,
//                                 placeholder: 'Удалить планы',
//                                 icon: TrashBin,
//                             },
//                             selectedButton,
//                             setSelectedButton,
//                         )}
//                     </motion.div>
//                 </motion.div>
//             </Modal>
//         </div>
//     );
// };
