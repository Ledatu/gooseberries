import {Button, Icon, List, Text, TextInput} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {useState} from 'react';
import {Pencil} from '@gravity-ui/icons';

export const AutoPhrasesTab = () => {
    const {template, advertWordsTemplateHandler} = useAdvertsWordsModal();
    const [valOfPlus, setValOfPlus] = useState<string>('');
    const [valOfMinus, setValOfMinus] = useState<string>('');
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 32,
            }}
        >
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, width: '48%'}}>
                <Text variant="header-2">Фразы должны содержать</Text>
                <TextInput
                    placeholder="Введите фразу сюда"
                    size="m"
                    value={valOfPlus}
                    onUpdate={(value) => setValOfPlus(value)}
                    onKeyDown={(handler) => {
                        if (handler.key == 'Enter') {
                            advertWordsTemplateHandler.addIncludes(valOfPlus);
                            setValOfPlus('');
                        }
                    }}
                />
                {/* <TextArea placeholder={`Поиск в ${template.includes.length} фразах`} size="l" /> */}
                <List
                    // sortable={true}
                    // filterable={false}
                    // itemHeight={28}
                    itemsHeight={500}
                    items={template.includes}
                    filterPlaceholder={`Поиск в ${template.includes.length} фразах`}
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
                                onClick={() => advertWordsTemplateHandler.deleteIncludes(item)}
                            >
                                <Text>{item}</Text>
                                <Button
                                    view="flat"
                                    size="s"
                                    onClick={() => {
                                        setValOfPlus(item);
                                        advertWordsTemplateHandler.deleteIncludes(item);
                                    }}
                                >
                                    <Icon data={Pencil} />
                                </Button>
                            </div>
                        );
                    }}
                />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, width: '48%'}}>
                <Text variant="header-2">Фразы не должны содержать</Text>
                <TextInput
                    placeholder="Введите фразу сюда"
                    size="m"
                    value={valOfMinus}
                    onUpdate={(value) => setValOfMinus(value)}
                    onKeyDown={(handler) => {
                        console.log(valOfMinus);
                        if (handler.key == 'Enter') {
                            advertWordsTemplateHandler.addNotIncludes(valOfMinus);
                            setValOfMinus('');
                        }
                    }}
                />
                <List
                    // sortable={true}
                    // filterable={false}
                    itemsHeight={500}
                    items={template.notIncludes}
                    filterPlaceholder={`Поиск в ${template.notIncludes.length} фразах`}
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
                                onClick={() => advertWordsTemplateHandler.deleteNotIncludes(item)}
                            >
                                <Text>{item}</Text>
                                <Button
                                    view="flat"
                                    size="s"
                                    onClick={() => {
                                        setValOfMinus(item);
                                        advertWordsTemplateHandler.deleteNotIncludes(item);
                                    }}
                                >
                                    <Icon data={Pencil} />
                                </Button>
                            </div>
                        );
                        // return <Text>{item}</Text>;
                    }}
                />
            </div>
        </div>
    );
};
