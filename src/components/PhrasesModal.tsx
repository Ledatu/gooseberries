import {Button, Card, Icon, List, Modal, Text, TextInput} from '@gravity-ui/uikit';
import {Magnifier, TrashBin} from '@gravity-ui/icons';
import React, {useState} from 'react';
import callApi, {getUid} from 'src/utilities/callApi';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';
import {motion} from 'framer-motion';

export const PhrasesModal = ({selectValue, doc, setChangedDoc, getUniqueAdvertIdsFromThePage}) => {
    const [open, setOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');
    const [filterText, setFilterText] = useState('');
    const [plusPhrasesTemplatesLabels, setPlusPhrasesTemplatesLabels] = useState([] as any[]);

    return (
        <div>
            <Button
                view="action"
                size="l"
                onClick={() => {
                    setOpen(true);
                    const plusPhrasesTemplatesTemp: any[] = [];
                    for (const [name, _] of Object.entries(
                        doc.plusPhrasesTemplates[selectValue[0]],
                    )) {
                        plusPhrasesTemplatesTemp.push(name);
                    }

                    setPlusPhrasesTemplatesLabels(plusPhrasesTemplatesTemp);
                }}
            >
                <Icon data={Magnifier} />
                <Text variant="subheader-1">Фразы</Text>
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Card
                    view="clear"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%',
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        style={{
                            width: '70em',
                            overflow: 'hidden',
                            flexWrap: 'nowrap',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#221d220f',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            padding: 30,
                            borderRadius: 30,
                            border: '1px solid #eee2',
                        }}
                    >
                        <Text
                            style={{
                                margin: '8px 0',
                            }}
                            variant="display-2"
                        >
                            Шаблоны
                        </Text>

                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <TextInput
                                placeholder={`Поиск в ${plusPhrasesTemplatesLabels.length} шаблонах`}
                                value={filterText}
                                size="l"
                                onUpdate={(val) => setFilterText(val)}
                                hasClear
                                style={{marginBottom: 8}}
                            />
                            <List
                                size="l"
                                filterable={false}
                                onItemClick={(item) => {
                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {advertsIds: {}},
                                    };
                                    const uniqueAdverts = getUniqueAdvertIdsFromThePage();
                                    for (const [id, advertData] of Object.entries(uniqueAdverts)) {
                                        if (!id || !advertData) continue;
                                        const {advertId} = advertData as any;
                                        params.data.advertsIds[advertId] = {
                                            advertId: advertId,
                                            mode: 'Установить',
                                            templateName: item,
                                        };

                                        if (
                                            !doc.advertsPlusPhrasesTemplates[selectValue[0]][
                                                advertId
                                            ]
                                        )
                                            doc.advertsPlusPhrasesTemplates[selectValue[0]][
                                                advertId
                                            ] = {};
                                        doc.advertsPlusPhrasesTemplates[selectValue[0]][
                                            advertId
                                        ].templateName = item;
                                    }

                                    console.log(params);

                                    /////////////////////////
                                    callApi('setAdvertsPlusPhrasesTemplates', params);
                                    setChangedDoc({...doc});
                                    /////////////////////////
                                    setOpen(false);
                                }}
                                renderItem={(item, isItemActive) => {
                                    return (
                                        <div
                                            style={{
                                                padding: 8,
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%',
                                            }}
                                        >
                                            <Text>{item}</Text>
                                            {isItemActive ? (
                                                <Button
                                                    size="xs"
                                                    view="flat"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        const params = {
                                                            uid: getUid(),
                                                            campaignName: selectValue[0],
                                                            data: {
                                                                mode: 'Удалить',
                                                                name: item,
                                                            },
                                                        };
                                                        const paramsAddToArt = {
                                                            uid: getUid(),
                                                            campaignName: selectValue[0],
                                                            data: {advertsIds: {}},
                                                        };

                                                        delete doc.plusPhrasesTemplates[
                                                            selectValue[0]
                                                        ][item];
                                                        setPlusPhrasesTemplatesLabels((val) => {
                                                            return val.filter((name) => {
                                                                return name != item;
                                                            });
                                                        });

                                                        if (
                                                            doc.advertsPlusPhrasesTemplates[
                                                                selectValue[0]
                                                            ]
                                                        )
                                                            for (const [
                                                                advertId,
                                                                advertData,
                                                            ] of Object.entries(
                                                                doc.advertsPlusPhrasesTemplates[
                                                                    selectValue[0]
                                                                ],
                                                            )) {
                                                                if (!advertId || !advertData)
                                                                    continue;
                                                                if (
                                                                    advertData['templateName'] ==
                                                                    item
                                                                ) {
                                                                    doc.advertsPlusPhrasesTemplates[
                                                                        selectValue[0]
                                                                    ][advertId] = undefined;
                                                                    paramsAddToArt.data.advertsIds[
                                                                        advertId
                                                                    ] = {
                                                                        mode: 'Удалить',
                                                                        templateName: item,
                                                                    };
                                                                }
                                                            }
                                                        console.log(paramsAddToArt);
                                                        console.log(params);

                                                        callApi(
                                                            'setAdvertsPlusPhrasesTemplates',
                                                            paramsAddToArt,
                                                        );

                                                        /////////////////////////
                                                        callApi('setPlusPhraseTemplate', params);
                                                        setChangedDoc({...doc});
                                                        /////////////////////////
                                                    }}
                                                >
                                                    <Icon data={TrashBin} />
                                                </Button>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    );
                                }}
                                items={plusPhrasesTemplatesLabels.filter((item) => {
                                    return item
                                        .toLocaleLowerCase()
                                        .includes(filterText.toLocaleLowerCase());
                                })}
                                itemsHeight={300}
                                itemHeight={28}
                            />
                        </div>
                        {generateModalButtonWithActions(
                            {
                                view: 'flat-danger',
                                icon: TrashBin,
                                placeholder: 'Убрать шаблон управления фразами с РК',
                                onClick: () => {
                                    const params = {
                                        uid: getUid(),
                                        campaignName: selectValue[0],
                                        data: {advertsIds: {}},
                                    };
                                    const uniqueAdverts = getUniqueAdvertIdsFromThePage();
                                    for (const [id, advertData] of Object.entries(uniqueAdverts)) {
                                        if (!id || !advertData) continue;
                                        const {advertId} = advertData as any;
                                        params.data.advertsIds[advertId] = {
                                            advertId: advertId,
                                            mode: 'Удалить',
                                        };

                                        doc.advertsPlusPhrasesTemplates[selectValue[0]][advertId] =
                                            undefined;
                                    }
                                    console.log(params);

                                    /////////////////////////
                                    callApi('setAdvertsPlusPhrasesTemplates', params);
                                    setChangedDoc({...doc});
                                    /////////////////////////
                                    setOpen(false);
                                },
                            },
                            selectedButton,
                            setSelectedButton,
                        )}
                    </motion.div>
                </Card>
            </Modal>
        </div>
    );
};
