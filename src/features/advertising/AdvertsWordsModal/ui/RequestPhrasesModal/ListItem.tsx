import {ActionTooltip, Button, Icon, Text} from '@gravity-ui/uikit';
import {PhrasesStats} from '../../types/PhraseStats';
import {Eye, Magnifier} from '@gravity-ui/icons';

interface ListItemProps {
    item: PhrasesStats;
    showViews?: boolean;
    showFrequncy?: boolean;
}

export const ListItem = ({item, showViews = true, showFrequncy = true}: ListItemProps) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                padding: 8,
                width: '100%',
                justifyContent: 'space-between',
            }}
        >
            <ActionTooltip title={item.keyword}>
                <Text ellipsis={true} style={{alignContent: 'center'}}>
                    {item.keyword}
                </Text>
            </ActionTooltip>
            <div style={{display: 'flex', flexDirection: 'row', gap: 8, padding: 8}}>
                {showViews ? (
                    <Button view="flat-warning">
                        <Icon data={Eye} />
                        {item.views}
                    </Button>
                ) : undefined}
                {showFrequncy ? (
                    <Button view="flat-warning">
                        <Icon data={Magnifier} />
                        {item.frequency}
                    </Button>
                ) : undefined}
            </div>
        </div>
    );
};
