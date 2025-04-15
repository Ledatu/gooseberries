import {ActionTooltip, Button, Icon} from '@gravity-ui/uikit';
import {EyesLookRight} from '@gravity-ui/icons';
import {useClustersTableContext} from '../../hooks/ClustersTableContext';
import {useAdvertsWordsModal} from '../../hooks/AdvertsWordsModalContext';
import {useMemo} from 'react';

export const ParsePositionMassButton = () => {
    const {parsePosition} = useAdvertsWordsModal();
    const {filteredData} = useClustersTableContext();

    const phrases = useMemo(
        () => filteredData?.slice(0, 50).map((row) => row?.cluster),
        [filteredData],
    );

    return (
        <ActionTooltip
            openDelay={800}
            title="Нажмите, чтобы найти товар в выдаче по первым 50 кластерам в таблице."
        >
            <Button view="outlined" onClick={() => parsePosition(phrases)}>
                <Icon data={EyesLookRight} />
                Найти в выдаче
            </Button>
        </ActionTooltip>
    );
};
