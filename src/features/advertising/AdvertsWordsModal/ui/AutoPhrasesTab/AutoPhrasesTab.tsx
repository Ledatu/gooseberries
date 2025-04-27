import {Button, Icon, List, NumberInput, Text, TextInput} from '@gravity-ui/uikit';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {useEffect, useState} from 'react';
import {Pencil} from '@gravity-ui/icons';
import {OffersWordsModal} from '../OfferWordsModal/OfferWordsModal';
import {PhrasesStats} from '../../types/PhraseStats';
import {motion} from 'framer-motion';

export const AutoPhrasesTab = () => {
    const {template, advertWordsTemplateHandler, setTemplate, wordsStats} = useAdvertsWordsModal();
    const [valOfPlus, setValOfPlus] = useState<string>('');
    const [valOfMinus, setValOfMinus] = useState<string>('');

    const [activeWords, setActiveWords] = useState<PhrasesStats[]>(
        wordsStats.filter((stat) => !template.includes.includes(stat.keyword)),
    );
    const [inactiveWords, setInactiveWords] = useState<PhrasesStats[]>(
        wordsStats.filter((stat) => !template.notIncludes.includes(stat.keyword)),
    );

    useEffect(() => {
        setActiveWords(wordsStats.filter((stat) => !template.includes.includes(stat.keyword)));
        setInactiveWords(wordsStats.filter((stat) => !template.notIncludes.includes(stat.keyword)));
    }, [wordsStats, template]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', padding: 32, gap: 16}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                <Text variant="header-1">Использовать автофразы если показов больше или равно</Text>
                <NumberInput
                    min={0}
                    size="l"
                    style={{width: 80}}
                    value={template.viewsThreshold}
                    onUpdate={(value) => setTemplate({...template, viewsThreshold: value || 0})}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, width: '48%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                        <Text variant="header-2">Фразы должны содержать</Text>
                        <OffersWordsModal
                            items={activeWords}
                            onClick={(item) => {
                                advertWordsTemplateHandler.addIncludes(item.keyword);
                            }}
                            arrayToAdd={template.includes.concat(template.notIncludes)}
                            title="Показать слова"
                        />
                    </div>
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
                                <motion.div
                                    initial={{opacity: 0, y: 15}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: 15}}
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
                                </motion.div>
                            );
                        }}
                    />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, width: '48%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                        <Text variant="header-2">Фразы не должны содержать</Text>
                        <OffersWordsModal
                            items={inactiveWords}
                            onClick={(item) => {
                                advertWordsTemplateHandler.addNotIncludes(item.keyword);
                            }}
                            arrayToAdd={template.includes.concat(template.notIncludes)}
                            title="Показать слова"
                        />
                    </div>
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
                                <motion.div
                                    style={{
                                        padding: 8,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        alignItems: 'center',
                                    }}
                                    initial={{opacity: 0, y: 15}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: 15}}
                                    onClick={() =>
                                        advertWordsTemplateHandler.deleteNotIncludes(item)
                                    }
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
                                </motion.div>
                            );
                            // return <Text>{item}</Text>;
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
