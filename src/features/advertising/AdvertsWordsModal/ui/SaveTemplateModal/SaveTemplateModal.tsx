import {ActionTooltip, Button, Icon, Text, TextInput} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {useEffect, useState} from 'react';
import {Check, Xmark} from '@gravity-ui/icons';
import {ModalWindow} from '@/shared/ui/Modal';

export const SaveTemplateModal = () => {
    const {saveOpen, template, setSaveOpen, advertWordsTemplateHandler, saveTemplate, getNames} =
        useAdvertsWordsModal();
    const [newTemplateName, setNewTemplateName] = useState<string>(``);
    const [isNew, setIsNew] = useState<boolean>(false);
    useEffect(() => {
        setNewTemplateName(`${template.name}_Копия`);
    }, [template]);

    const handleSaveNewTemplateButton = () => {
        advertWordsTemplateHandler.changeName(newTemplateName);
        setIsNew(false);
        saveTemplate(newTemplateName);
        getNames();
        setSaveOpen(false);
    };

    const handleSaveButton = () => {
        setIsNew(false);
        saveTemplate();
        getNames();
        setSaveOpen(false);
    };
    return (
        <ModalWindow isOpen={saveOpen} handleClose={() => setSaveOpen(false)}>
            {isNew ? (
                <div
                    style={{
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        alignItems: 'center',
                    }}
                >
                    <TextInput
                        validationState={!newTemplateName ? 'invalid' : undefined}
                        hasClear
                        placeholder="Имя шаблона"
                        size="l"
                        value={newTemplateName}
                        onUpdate={(value) => setNewTemplateName(value)}
                    />
                    <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                        <Button
                            disabled={!newTemplateName}
                            size="l"
                            selected
                            pin="circle-circle"
                            view="flat-success"
                            onClick={() => {
                                handleSaveNewTemplateButton();
                            }}
                        >
                            <Icon data={Check} />
                            <Text>Сохранить</Text>
                        </Button>
                        <Button
                            pin="circle-circle"
                            size="l"
                            onClick={() => {
                                setIsNew(false);
                            }}
                        >
                            <Icon data={Xmark} />
                            <Text>Отменить</Text>
                        </Button>
                    </div>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                    <ActionTooltip title="Изменения скажутся на всех РК с таким же шаблоном.">
                        <Button
                            pin="circle-circle"
                            size="l"
                            view="outlined-action"
                            onClick={() => handleSaveButton()}
                        >
                            <Text>Обновить настройки шаблона</Text>
                        </Button>
                    </ActionTooltip>
                    <ActionTooltip title="Шаблон изменится только на этой РК.">
                        <Button
                            pin="circle-circle"
                            size="l"
                            view="flat"
                            onClick={() => setIsNew(!isNew)}
                        >
                            <Text>Сохранить как новый</Text>
                        </Button>
                    </ActionTooltip>
                </div>
            )}
        </ModalWindow>
    );
};
