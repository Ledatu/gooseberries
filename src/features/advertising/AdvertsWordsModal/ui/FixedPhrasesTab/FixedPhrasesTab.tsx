import {Button, Icon, List, Switch, Text, TextInput} from '@gravity-ui/uikit';
import {useEffect, useState} from 'react';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {Pencil} from '@gravity-ui/icons';
import {PhrasesStats} from '../../types/PhraseStats';
import {ClusterData} from '../../api';
import {OffersWordsModal} from '../OfferWordsModal/OfferWordsModal';

const clusterDataPhrasesStatMap = (cluster: ClusterData): PhrasesStats => {
    return {
        views: cluster.views,
        keyword: cluster.cluster,
        frequency: cluster.totalFrequency,
    };
};

export const FixedPhrasesTab = () => {
    const {advertWordsTemplateHandler, template, stats, excludedStats} = useAdvertsWordsModal();
    const [allClusters, setAllClusters] = useState(stats.concat(excludedStats));
    useEffect(() => {
        setAllClusters(stats.concat(excludedStats));
    }, [stats, excludedStats]);

    const [offerClusters, setOfferClusters] = useState<PhrasesStats[]>(
        allClusters
            .map(clusterDataPhrasesStatMap)
            .filter((phrase) => !template.fixedClusters.includes(phrase.keyword)),
    );
    useEffect(() => {
        setOfferClusters(allClusters.map(clusterDataPhrasesStatMap));
    }, [allClusters]);
    const [fixedPhrase, setFixedPhrase] = useState<string>('');
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingRight: 8,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                    <Text variant="header-2">Фиксировать кластеры</Text>
                    <OffersWordsModal
                        items={offerClusters}
                        arrayToAdd={template.fixedClusters}
                        onClick={(item) => advertWordsTemplateHandler.addFixedPhrases(item.keyword)}
                        title="Показать кластеры"
                    />
                </div>
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
                itemsHeight={720}
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
    );
};
