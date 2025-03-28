import {Button, Icon, List, Switch, Text, TextInput} from '@gravity-ui/uikit';
import {useState} from 'react';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {Pencil} from '@gravity-ui/icons';

export const FixedPhrasesTab = () => {
    const {advertWordsTemplateHandler, template} = useAdvertsWordsModal();
    const [fixedPhrase, setFixedPhrase] = useState<string>('');
    return (
        <div style={{width : 300}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <div style={{display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent : 'space-between'}}>
                    <Text variant="header-2">Фикс фразы</Text>
                    <Switch
                        checked={template.isFixed}
                        onUpdate={(checked) => {
                            advertWordsTemplateHandler.changeIsFixed(checked);
                        }}
                    />
                </div>
                <TextInput
                    placeholder="Введите фразу сюда"
                    size="m"
                    disabled={!template.isFixed}
                    value={fixedPhrase}
                    onUpdate={(value) => setFixedPhrase(value)}
                    onKeyDown={(handler) => {
                        if (handler.key == 'Enter') {
                            advertWordsTemplateHandler.addFixedPhrases(fixedPhrase);
                            setFixedPhrase('');
                        }
                    }}
                />
                <List
                    itemsHeight={500}
                    items={template.fixedClusters}
                    filterPlaceholder={`Поиск в ${template.fixedClusters.length} фразах`}
                    renderItem={(item) => {
                        return (
                            <div
                                style={{
                                    padding: 8,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    alignItems: 'center',
                                }}
                                onClick={() => advertWordsTemplateHandler.deleteFixedPhrases(item)}
                            >
                                <Text>{item}</Text>
                                <Button
                                    view="flat"
                                    size="s"
                                    onClick={() => {
                                        setFixedPhrase(item);
                                        advertWordsTemplateHandler.deleteFixedPhrases(item);
                                    }}
                                >
                                    <Icon data={Pencil} />
                                </Button>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
};
