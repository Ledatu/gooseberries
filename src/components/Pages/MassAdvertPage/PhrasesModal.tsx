'use client';

import {Button, Icon, List, Text, TextInput} from '@gravity-ui/uikit';
import {Magnifier, TrashBin, Check, Xmark} from '@gravity-ui/icons';
import {useEffect, useState} from 'react';
// import {NewPhrasesTemplate} from './NewPhrasesTemplate';
import {useCampaign} from '@/contexts/CampaignContext';
import {useError} from '@/contexts/ErrorContext';
import {ModalWindow} from '@/shared/ui/Modal';
import {getTemplateNames} from '@/features/advertising/AdvertsWordsModal/api/getTemplatesNames';
import {deleteAutoPhrasesTemplateOfAdvert} from '@/features/advertising/AdvertsWordsModal/api/deleteAutoPhrasesTemplateOfAdvert';
import {changeTemplateNameOfAdvert} from '@/features/advertising/AdvertsWordsModal/api/changeTemplateNameOfAdvert';

interface PhrasesModalProps {
    disabled: boolean;
    getTemplates: Function;
    getUniqueAdvertIdsFromThePage: (args?: any) => any;
}

export const PhrasesModal = ({
    disabled,
    getTemplates,
    getUniqueAdvertIdsFromThePage,
}: PhrasesModalProps) => {
    const {sellerId} = useCampaign();
    const {showError} = useError();
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [plusPhrasesTemplatesLabels, setPlusPhrasesTemplatesLabels] = useState([] as any[]);

    const getNames = async () => {
        const plusPhrasesTemplatesTemp: any[] = await getTemplateNames(sellerId);
        plusPhrasesTemplatesTemp.sort((a, b) =>
            a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()),
        );
        setPlusPhrasesTemplatesLabels(plusPhrasesTemplatesTemp);
    };

    useEffect(() => {
        if (!open) return;
        getNames();
    }, [open]);

    const changeTemplate = async (templateName: string) => {
        setOpen(false);
        try {
            const uniqueAdverts = Object.entries(getUniqueAdvertIdsFromThePage()).map(
                ([id, _]: any) => parseInt(id),
            );
            try {
                await changeTemplateNameOfAdvert({
                    templateName: templateName,
                    advertIds: uniqueAdverts,
                    seller_id: sellerId,
                });
            } catch (error) {
                console.error(new Date(), 'error change template', error);
                showError('Не удалось сменить правило фраз');
            }
            getTemplates();
        } catch (error) {
            console.error(error);
        }
    };

    const removeTemplate = async () => {
        setOpen(false);
        try {
            const uniqueAdverts = Object.entries(getUniqueAdvertIdsFromThePage()).map(
                ([id, _]: any) => parseInt(id),
            );
            try {
                const dd = Date.now();
                await deleteAutoPhrasesTemplateOfAdvert({
                    advertIds: uniqueAdverts,
                    seller_id: sellerId,
                });
                console.log('deleted in', (Date.now() - dd) / 1000);
            } catch (error) {
                console.error(new Date(), 'error change template', error);
                showError('Не удалось удалить правило фраз');
            }
            getTemplates();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Button
                disabled={disabled}
                view="action"
                size="l"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <Icon data={Magnifier} />
                <Text variant="subheader-1">Фразы</Text>
            </Button>
            <ModalWindow isOpen={open} handleClose={() => setOpen(false)}>
                <div
                    style={{
                        width: '70em',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                    }}
                >
                    <Text
                        style={{
                            margin: '8px 0',
                        }}
                        variant="display-2"
                    >
                        Правила управления фразами РК
                    </Text>
                    <TextInput
                        placeholder={`Поиск в ${plusPhrasesTemplatesLabels.length} правилах`}
                        value={filterText}
                        size="l"
                        onUpdate={(val) => setFilterText(val)}
                        hasClear
                    />
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            height: '70vh',
                        }}
                    >
                        <List
                            size="l"
                            filterable={false}
                            renderItem={(item) => {
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
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Button
                                                pin="circle-circle"
                                                onClick={() => changeTemplate(item)}
                                            >
                                                <Icon data={Check} />
                                                Установить правило на РК
                                            </Button>
                                            <div style={{minWidth: 8}} />

                                            <Button
                                                pin="circle-circle"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                }}
                                            >
                                                <Icon data={TrashBin} />
                                                Удалить правило
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }}
                            items={plusPhrasesTemplatesLabels.filter((item) => {
                                return item
                                    .toLocaleLowerCase()
                                    .includes(filterText.toLocaleLowerCase());
                            })}
                            itemHeight={44}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {/* <NewPhrasesTemplate doc={doc} setChangedDoc={setChangedDoc}>
                            <Button disabled={disabled} pin="circle-circle" size="l">
                                <Icon data={Plus} />
                                Создать правило
                            </Button>
                        </NewPhrasesTemplate> */}
                        <Button
                            view="flat-danger"
                            size="l"
                            style={{margin: '4px'}}
                            onClick={() => removeTemplate()}
                        >
                            <Icon data={Xmark} />
                            Убрать правило управления фразами с РК
                        </Button>
                    </div>
                </div>
            </ModalWindow>
        </div>
    );
};
