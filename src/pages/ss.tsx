// {/* <motion.div
//     layout
//     animate={{height: semanticsModalFormOpen ? '80vh' : 0}}
//     transition={{ease: 'easeInOut', duration: 0.2}}
//     style={{
//         // height: '60vh',
//         display: 'flex',
//         justifyContent: 'space-between',
//         flexDirection: isDesktop ? 'row' : 'column',
//         width: isDesktop ? '80vw' : '70vw',
//         padding: 32,
//         overflow: 'auto',
//     }}
// >
//     <motion.div
//         layout
//         // animate={{x: semanticsModalFormOpen ? 0 : -1000}}
//         // transition={{delay: 2, type: 'spring'}}
//         style={{
//             display: 'flex',
//             height: !isDesktop ? '23vh' : undefined,
//             width: isDesktop ? '25vw' : undefined,
//             flexDirection: 'column',
//         }}
//     >
//         <div
//             style={{
//                 marginBottom: 8,
//                 display: 'flex',
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             }}
//         >
//             <Text variant="header-1">Кластеры в показах</Text>
//             <Button
//                 onClick={() => {
//                     const val = Array.from(semanticsModalSemanticsPlusItemsValue);
//                     for (let i = 0; i < semanticsModalSemanticsItemsFiltratedValue.length; i++) {
//                         const cluster = semanticsModalSemanticsItemsFiltratedValue[i].cluster;
//                         if (val.includes(cluster)) continue;
//                         val.push(cluster);
//                         // console.log(keyword);
//                     }
//                     // console.log(val);

//                     setSemanticsModalSemanticsPlusItemsValue(val);
//                 }}
//             >
//                 Добавить все
//             </Button>
//         </div>
//         {/* {generateFilterTextInputsForClusterStats({
//                                     filters: clustersFiltersActive,
//                                     setFilters: setClustersFiltersActive,
//                                     filterData: clustersFilterDataActive,
//                                     sortBy: clustersSortByActive,
//                                     setSortBy: setClustersSortByActive,
//                                     sortData: clustersSortDataActive,
//                                 })} */}
//         <List
//             // filterable={false}
//             filterPlaceholder={`Поиск в ${semanticsModalSemanticsItemsValue.length} фразах`}
//             items={semanticsModalSemanticsItemsValue}
//             onFilterEnd={({items}) => {
//                 setSemanticsModalSemanticsItemsFiltratedValue(items);
//                 // console.log(
//                 //     semanticsModalSemanticsItemsFiltratedValue.length,
//                 // );
//             }}
//             filterItem={(filter) => (item) => {
//                 return item.cluster.includes(filter);
//             }}
//             itemHeight={(item) => {
//                 return 20 * Math.ceil(item.cluster.length / 30) + 60;
//             }}
//             renderItem={(item) =>
//                 renderPhrasesStatListItem(
//                     item,
//                     semanticsModalSemanticsPlusItemsValue,
//                     setFetchedPlacements,
//                     doc,
//                     setChangedDoc,
//                     selectValue,
//                     true,
//                     semanticsModalOpenFromArt,
//                     selectedSearchPhrase,
//                     setSelectedSearchPhrase,
//                     currentParsingProgress,
//                     setCurrentParsingProgress,
//                 )
//             }
//             onItemClick={(item) => {
//                 let val = Array.from(semanticsModalSemanticsPlusItemsValue);
//                 const {cluster} = item;
//                 if (!val.includes(cluster)) {
//                     val.push(cluster);
//                 } else {
//                     val = val.filter((value) => value != cluster);
//                 }
//                 setSemanticsModalSemanticsPlusItemsValue(val);
//             }}
//         />
//     </motion.div>
//     <motion.div
//         layout
//         // animate={{x: semanticsModalFormOpen ? 0 : -1000}}
//         // transition={{delay: 2, type: 'spring'}}
//         style={{
//             display: 'flex',
//             height: !isDesktop ? '23vh' : undefined,
//             width: isDesktop ? '25vw' : undefined,
//             flexDirection: 'column',
//         }}
//     >
//         <div
//             style={{
//                 marginBottom: 8,
//                 display: 'flex',
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             }}
//         >
//             <Text variant="header-1">Исключенные кластеры</Text>
//             <Button
//                 onClick={() => {
//                     const val = Array.from(semanticsModalSemanticsPlusItemsValue);
//                     for (
//                         let i = 0;
//                         i < semanticsModalSemanticsMinusItemsFiltratedValue.length;
//                         i++
//                     ) {
//                         const cluster = semanticsModalSemanticsMinusItemsFiltratedValue[i].cluster;
//                         if (val.includes(cluster)) continue;
//                         val.push(cluster);
//                         // console.log(keyword);
//                     }
//                     // console.log(val);

//                     setSemanticsModalSemanticsPlusItemsValue(val);
//                 }}
//             >
//                 Добавить все
//             </Button>
//         </div>
//         {/* {generateFilterTextInputsForClusterStats({
//                                     filters: clustersFiltersMinus,
//                                     setFilters: setClustersFiltersMinus,
//                                     filterData: clustersFilterDataMinus,
//                                     sortBy: clustersSortByMinus,
//                                     setSortBy: setClustersSortByMinus,
//                                     sortData: clustersSortDataMinus,
//                                 })} */}
//         <List
//             // filterable={false}
//             onFilterEnd={({items}) => {
//                 setSemanticsModalSemanticsMinusItemsFiltratedValue(items);
//             }}
//             filterItem={(filter) => (item) => {
//                 return item.cluster.includes(filter);
//             }}
//             items={semanticsModalSemanticsMinusItemsValue}
//             filterPlaceholder={`Поиск в ${semanticsModalSemanticsMinusItemsValue.length} фразах`}
//             itemHeight={(item) => {
//                 return 20 * Math.ceil(item.cluster.length / 30) + 20;
//             }}
//             renderItem={(item) =>
//                 renderPhrasesStatListItem(
//                     item,
//                     semanticsModalSemanticsPlusItemsValue,
//                     setFetchedPlacements,
//                     doc,
//                     setChangedDoc,
//                     selectValue,
//                     false,
//                     semanticsModalOpenFromArt,
//                     selectedSearchPhrase,
//                     setSelectedSearchPhrase,
//                     currentParsingProgress,
//                     setCurrentParsingProgress,
//                 )
//             }
//             onItemClick={(item) => {
//                 let val = Array.from(semanticsModalSemanticsPlusItemsValue);
//                 const {cluster} = item;
//                 if (!val.includes(cluster)) {
//                     val.push(cluster);
//                 } else {
//                     val = val.filter((value) => value != cluster);
//                 }
//                 setSemanticsModalSemanticsPlusItemsValue(val);
//             }}
//         />
//     </motion.div>
//     <motion.div
//         layout
//         // animate={{x: semanticsModalFormOpen ? 0 : -1000}}
//         // transition={{delay: 2, type: 'spring'}}
//         style={{
//             display: 'flex',
//             height: !isDesktop ? '23vh' : '100%',
//             width: isDesktop ? '25vw' : undefined,
//             flexDirection: 'column',
//             // justifyContent: 'space-',
//         }}
//     >
//         <div
//             style={{
//                 marginBottom: 8,
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//             }}
//         >
//             {/* <Text variant="header-1">Плюс фразы</Text> */}
//             <Button
//                 width="max"
//                 size="m"
//                 view={
//                     semanticsModalSemanticsPlusItemsTemplateNameValue == 'Не установлен'
//                         ? 'normal'
//                         : 'flat-info'
//                 }
//                 selected={semanticsModalSemanticsPlusItemsTemplateNameValue != 'Не установлен'}
//             >
//                 {semanticsModalSemanticsPlusItemsTemplateNameValue}
//             </Button>
//         </div>
//         <div
//             style={{
//                 marginBottom: 8,
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             }}
//         >
//             <Button
//                 width="max"
//                 selected={semanticsModalIsFixed}
//                 onClick={() => setSemanticsModalIsFixed(!semanticsModalIsFixed)}
//             >
//                 {`Фикс. ${!semanticsModalIsFixed ? 'выкл.' : 'вкл.'}`}
//             </Button>
//             <div style={{width: 16}} />
//             <Button
//                 width="max"
//                 view={
//                     semanticsAutoPhrasesModalIncludesList.length ||
//                     semanticsAutoPhrasesModalNotIncludesListInput.length
//                         ? 'flat-success'
//                         : 'normal'
//                 }
//                 selected={
//                     semanticsAutoPhrasesModalIncludesList.length ||
//                     semanticsAutoPhrasesModalNotIncludesListInput.length
//                         ? true
//                         : undefined
//                 }
//                 onClick={() => {
//                     setSemanticsAutoPhrasesModalFormOpen(!semanticsAutoPhrasesModalFormOpen);

//                     // setSemanticsModalTextAreaAddMode(
//                     //     !semanticsModalTextAreaAddMode,
//                     // );
//                     // const rows = semanticsModalTextAreaValue.split('\n');
//                     // const val = Array.from(
//                     //     semanticsModalSemanticsPlusItemsValue,
//                     // );
//                     // for (let i = 0; i < rows.length; i++) {
//                     //     const cluster = rows[i].trim();
//                     //     if (!cluster || cluster === '') continue;
//                     //     if (!val.includes(cluster)) {
//                     //         val.push(cluster);
//                     //     }
//                     // }
//                     // setSemanticsModalSemanticsPlusItemsValue(val);
//                     // setSemanticsModalTextAreaValue('');
//                 }}
//             >
//                 {`Автофразы`}
//             </Button>
//         </div>
//         <Modal
//             open={semanticsAutoPhrasesModalFormOpen}
//             onClose={() => {
//                 setSemanticsAutoPhrasesModalFormOpen(false);
//             }}
//         >
//             <div
//                 style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     height: '70vh',
//                     width: '70vw',
//                     justifyContent: 'space-between',
//                     margin: '30px 30px',
//                 }}
//             >
//                 <div
//                     style={{
//                         display: 'flex',
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                     }}
//                 >
//                     <div
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             height: '68vh',
//                             width: '48%',
//                         }}
//                     >
//                         <Text variant="header-1">Фразы должны содержать</Text>
//                         <div style={{height: 8}} />
//                         <TextInput
//                             value={semanticsAutoPhrasesModalIncludesListInput}
//                             onKeyPress={(e) => {
//                                 if (e.key === 'Enter') {
//                                     if (
//                                         !semanticsAutoPhrasesModalIncludesList.includes(
//                                             semanticsAutoPhrasesModalIncludesListInput,
//                                         ) &&
//                                         semanticsAutoPhrasesModalIncludesListInput != ''
//                                     )
//                                         semanticsAutoPhrasesModalIncludesList.push(
//                                             semanticsAutoPhrasesModalIncludesListInput,
//                                         );
//                                     setSemanticsAutoPhrasesModalIncludesListInput('');
//                                 }
//                             }}
//                             onUpdate={(value) => {
//                                 setSemanticsAutoPhrasesModalIncludesListInput(value);
//                             }}
//                             placeholder={' Вводите правила сюда'}
//                         />
//                         <div style={{height: 8}} />
//                         <List
//                             itemHeight={(item) => {
//                                 return 20 * Math.ceil(item.length / 60) + 20;
//                             }}
//                             renderItem={(item) => {
//                                 if (!item) return;
//                                 return (
//                                     <div
//                                         style={{
//                                             display: 'flex',
//                                             flexDirection: 'row',
//                                             justifyContent: 'space-between',
//                                             margin: '0 8px',
//                                             width: '100%',
//                                         }}
//                                         title={item}
//                                     >
//                                         <div
//                                             style={{
//                                                 textWrap: 'wrap',
//                                             }}
//                                         >
//                                             <Text>{item}</Text>
//                                         </div>
//                                         <div
//                                             style={{
//                                                 display: 'flex',
//                                                 flexDirection: 'row',
//                                             }}
//                                         >
//                                             <Button
//                                                 size="xs"
//                                                 view="flat"
//                                                 onClick={() => {
//                                                     setSemanticsAutoPhrasesModalIncludesListInput(
//                                                         item,
//                                                     );
//                                                 }}
//                                             >
//                                                 <Icon data={Pencil} size={14}></Icon>
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 );
//                             }}
//                             filterPlaceholder={`Поиск в ${semanticsAutoPhrasesModalIncludesList.length} фразах`}
//                             onItemClick={(rule) => {
//                                 let val = Array.from(semanticsAutoPhrasesModalIncludesList);
//                                 val = val.filter((value) => value != rule);
//                                 setSemanticsAutoPhrasesModalIncludesList(val);
//                             }}
//                             items={semanticsAutoPhrasesModalIncludesList}
//                         />
//                     </div>
//                     <div
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             height: '68vh',
//                             width: '48%',
//                         }}
//                     >
//                         <Text variant="header-1">Фразы не должны содержать</Text>
//                         <div style={{height: 8}} />
//                         <TextInput
//                             value={semanticsAutoPhrasesModalNotIncludesListInput}
//                             onKeyPress={(e) => {
//                                 if (e.key === 'Enter') {
//                                     const arr = Array.from(
//                                         semanticsAutoPhrasesModalNotIncludesList as any[],
//                                     );
//                                     if (
//                                         !arr.includes(
//                                             semanticsAutoPhrasesModalNotIncludesListInput,
//                                         ) &&
//                                         semanticsAutoPhrasesModalNotIncludesListInput != ''
//                                     ) {
//                                         arr.push(semanticsAutoPhrasesModalNotIncludesListInput);
//                                         setSemanticsAutoPhrasesModalNotIncludesList(arr);
//                                     }
//                                     setSemanticsAutoPhrasesModalNotIncludesListInput('');
//                                     console.log(semanticsAutoPhrasesModalNotIncludesList);
//                                 }
//                             }}
//                             onUpdate={(value) => {
//                                 setSemanticsAutoPhrasesModalNotIncludesListInput(value);
//                             }}
//                             placeholder={' Вводите правила сюда'}
//                         />
//                         <div style={{height: 8}} />
//                         <List
//                             filterPlaceholder={`Поиск в ${semanticsAutoPhrasesModalNotIncludesList.length} фразах`}
//                             onItemClick={(rule) => {
//                                 let val = Array.from(semanticsAutoPhrasesModalNotIncludesList);
//                                 val = val.filter((value) => value != rule);
//                                 setSemanticsAutoPhrasesModalNotIncludesList(val);
//                             }}
//                             items={semanticsAutoPhrasesModalNotIncludesList}
//                         />
//                     </div>
//                 </div>
//                 <Button
//                     pin="circle-circle"
//                     view="action"
//                     onClick={() => setSemanticsAutoPhrasesModalFormOpen(false)}
//                 >
//                     Закрыть
//                 </Button>
//             </div>
//         </Modal>
//         <div
//             style={{
//                 marginBottom: 8,
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             }}
//         >
//             <TextInput
//                 style={{marginRight: 4}}
//                 label="Показы"
//                 hasClear
//                 value={String(semanticsModalSemanticsThresholdValue)}
//                 onUpdate={(val) => {
//                     setSemanticsModalSemanticsThresholdValue(Number(val));
//                 }}
//                 type="number"
//             />
//             <TextInput
//                 style={{marginLeft: 4}}
//                 label="CTR"
//                 hasClear
//                 value={String(semanticsModalSemanticsCTRThresholdValue)}
//                 onUpdate={(val) => {
//                     setSemanticsModalSemanticsCTRThresholdValue(Number(val));
//                 }}
//                 type="number"
//             />
//         </div>
//         <div
//             style={{
//                 marginBottom: 8,
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             }}
//         >
//             <TextInput
//                 style={{marginRight: 8}}
//                 placeholder="Имя"
//                 hasClear
//                 value={semanticsModalSemanticsPlusItemsTemplateNameSaveValue}
//                 onUpdate={(val) => {
//                     setSemanticsModalSemanticsPlusItemsTemplateNameSaveValue(val);
//                 }}
//             />
//             <Button
//                 onClick={() => {
//                     const name = semanticsModalSemanticsPlusItemsTemplateNameSaveValue.trim();
//                     const params = {
//                         uid: getUid(),
//                         campaignName: selectValue[0],
//                         data: {
//                             mode: 'Установить',
//                             isFixed: semanticsModalIsFixed,
//                             name: name,
//                             clusters: semanticsModalSemanticsPlusItemsValue,
//                             threshold: semanticsModalSemanticsThresholdValue,
//                             ctrThreshold: semanticsModalSemanticsCTRThresholdValue,
//                             autoPhrasesTemplate: {
//                                 includes: semanticsAutoPhrasesModalIncludesList,
//                                 notIncludes: semanticsAutoPhrasesModalNotIncludesList,
//                             },
//                         },
//                     };

//                     doc.plusPhrasesTemplates[selectValue[0]][name] = {
//                         isFixed: semanticsModalIsFixed,
//                         name: name,
//                         clusters: semanticsModalSemanticsPlusItemsValue,
//                         threshold: semanticsModalSemanticsThresholdValue,
//                         ctrThreshold: semanticsModalSemanticsCTRThresholdValue,
//                         autoPhrasesTemplate: {
//                             includes: semanticsAutoPhrasesModalIncludesList,
//                             notIncludes: semanticsAutoPhrasesModalNotIncludesList,
//                         },
//                     };
//                     {
//                         // ADDING TEMPLATE TO ART
//                         if (semanticsModalOpenFromArt && semanticsModalOpenFromArt != '') {
//                             const art = semanticsModalOpenFromArt;
//                             console.log(art);

//                             const paramsAddToArt = {
//                                 uid: getUid(),
//                                 campaignName: selectValue[0],
//                                 data: {arts: {}},
//                             };
//                             paramsAddToArt.data.arts[art] = {
//                                 mode: 'Установить',
//                                 templateName: name,
//                                 art: art,
//                             };

//                             console.log(paramsAddToArt, doc.campaigns[selectValue[0]][art]);

//                             if (!doc.campaigns[selectValue[0]][art].plusPhrasesTemplate)
//                                 doc.campaigns[selectValue[0]][art].plusPhrasesTemplate = {};
//                             doc.campaigns[selectValue[0]][art].plusPhrasesTemplate = name;
//                             callApi('setAdvertsPlusPhrasesTemplates', paramsAddToArt);
//                         }
//                     }

//                     console.log(params);

//                     setChangedDoc(doc);

//                     callApi('setPlusPhraseTemplate', params);

//                     setSemanticsModalFormOpen(false);
//                 }}
//             >
//                 Сохранить
//             </Button>
//         </div>
//         {/* semanticsModalTextAreaAddMode ? (
//                                     // <TextArea
//                                     //     onUpdate={(val) => {
//                                     //         setSemanticsModalTextAreaValue(val);
//                                     //     }}
//                                     //     hasClear
//                                     //     placeholder="Вводите фразы для добавления с новой строки"
//                                     //     maxRows={Math.round(
//                                     //         (windowDimensions.height * 0.4) / 16 + 10,
//                                     //     )}
//                                     // />
//                                 ) : ( */}
//         <List
//             itemHeight={(item) => {
//                 return 20 * Math.ceil(item.length / 45) + 20;
//             }}
//             items={semanticsModalSemanticsPlusItemsValue}
//             filterPlaceholder={`Поиск в ${semanticsModalSemanticsPlusItemsValue.length} фразах`}
//             onItemClick={(cluster) => {
//                 let val = Array.from(semanticsModalSemanticsPlusItemsValue);
//                 val = val.filter((value) => value != cluster);
//                 setSemanticsModalSemanticsPlusItemsValue(val);
//             }}
//             renderItem={(item) => {
//                 if (!item) return;
//                 return (
//                     <div
//                         style={{
//                             textOverflow: 'ellipsis',
//                             overflow: 'hidden',
//                             whiteSpace: 'nowrap',
//                         }}
//                         title={item}
//                     >
//                         <Text>{item}</Text>
//                     </div>
//                 );
//             }}
//         />
//     </motion.div>
// </motion.div>; */}
