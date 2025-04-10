import {Button, Card, Icon, Modal, Text, TextInput} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {useEffect, useState} from 'react';
import {cx} from '@/lib/utils';
import {HelpMark} from '@/components/Popups/HelpMark';
import {Check, Xmark} from '@gravity-ui/icons';

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
        <div>
            <Modal open={saveOpen} onOpenChange={(open) => setSaveOpen(open)}>
                <Card
                    className={cx(['centred-absolute-element', 'blurred-card'])}
                    style={{
                        height: 200,
                        width: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <Text variant="subheader-2">Выберите способ сохранения шаблона</Text>
                    {isNew ? (
                        <div
                            style={{
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                                alignItems: 'center',
                            }}
                        >
                            <TextInput
                                style={{width: 300}}
                                value={newTemplateName}
                                onUpdate={(value) => setNewTemplateName(value)}
                            />
                            <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                <Button
                                    view="flat-success"
                                    onClick={() => {
                                        handleSaveNewTemplateButton();
                                    }}
                                >
                                    <Text>Сохранить</Text>
                                    <Icon data={Check} />
                                </Button>
                                <Button
                                    view="flat-danger"
                                    onClick={() => {
                                        setIsNew(false);
                                    }}
                                >
                                    <Text>Отменить</Text>
                                    <Icon data={Xmark} />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                            <Button onClick={() => setIsNew(!isNew)}>
                                <Text>Сохранить как новый шаблон</Text>
                            </Button>
                            <div
                                style={{
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 4,
                                    alignItems: 'center',
                                }}
                            >
                                <Button onClick={() => handleSaveButton()}>
                                    <Text>Внести изменения в текущий</Text>
                                </Button>
                                <HelpMark content="Все автофразы у РК с таким же названием шаблона изменятся" />
                            </div>
                        </div>
                    )}
                </Card>
            </Modal>
        </div>
    );
};
