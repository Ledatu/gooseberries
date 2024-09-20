import {Button, Card, Icon, List, Modal, Text} from '@gravity-ui/uikit';
import {Magnifier, TrashBin} from '@gravity-ui/icons';
import React, {useState} from 'react';
import callApi, {getUid} from 'src/utilities/callApi';
import {generateModalButtonWithActions} from 'src/pages/MassAdvertPage';

export const PhrasesModal = ({selectValue, doc, setChangedDoc, getUniqueAdvertIdsFromThePage}) => {
    const [open, setOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');
    const [plusPhrasesTemplatesLabels, setPlusPhrasesTemplatesLabels] = useState<any[]>([]);

    return (
        <div>
            <Button
                style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
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
                        width: '80em',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <div
                        style={{
                            height: '50%',
                            width: '100%',

                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '16px 0',
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
                                width: '80%',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <List
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
                                filterPlaceholder={`Поиск в ${plusPhrasesTemplatesLabels.length} шаблонах`}
                                items={plusPhrasesTemplatesLabels}
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
                    </div>
                </Card>
            </Modal>
        </div>
    );
};
