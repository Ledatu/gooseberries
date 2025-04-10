import {useEffect, useState} from 'react';
import {PhrasesStats} from '../../api/PhraseStats';
import {getPhrasesStats} from '../../api/getPhrasesStats';
import {useCampaign} from '@/contexts/CampaignContext';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {useError} from '@/contexts/ErrorContext';
import {ModalWindow} from '@/shared/ui/Modal';
import {ActionTooltip, List, Text} from '@gravity-ui/uikit';
import {ListItem} from './ListItem';

interface RequestPhrasesModalProps {
    cluster: string;
}
export const RequestPhrasesModal = ({cluster}: RequestPhrasesModalProps) => {
    const [open, setOpen] = useState(false);
    const {sellerId} = useCampaign();
    const {advertId} = useAdvertsWordsModal();
    const {showError} = useError();

    const [stats, setStats] = useState<PhrasesStats[]>([]);

    const getStats = async () => {
        try {
            const stats: PhrasesStats[] = await getPhrasesStats(sellerId, advertId, cluster);
            setStats(stats);
        } catch (error) {
            console.error(error);
            showError('Ошибка, неудалось получить статистику');
        }
    };

    useEffect(() => {
        if (open) {
            getStats();
        }
    }, [open]);

    return (
        <div>
            <ActionTooltip title={cluster}>
                <Text
                    onClick={() => setOpen(true)}
                    ellipsis
                    style={{maxWidth: 250, alignContent: 'center', cursor: 'pointer'}}
                >
                    {cluster}
                </Text>
            </ActionTooltip>
            <ModalWindow isOpen={open} handleClose={() => setOpen(false)}>
                <div style={{padding: 8, width: 500}}>
                    <List
                        items={stats}
                        itemHeight={50}
                        itemsHeight={520}
                        renderItem={(item) => {
                            return <ListItem item={item} />;
                        }}
                        filterItem={(filter) => {
                            const filterFunction = (item: PhrasesStats) => {
                                return item.keyword.includes(filter);
                            };
                            return filterFunction;
                        }}
                    />
                </div>
            </ModalWindow>
        </div>
    );
};
