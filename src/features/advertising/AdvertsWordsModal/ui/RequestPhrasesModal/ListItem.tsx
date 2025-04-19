import {ActionTooltip, Button, Icon, Text} from '@gravity-ui/uikit';
import {PhrasesStats} from '../../api/PhraseStats';
import {Magnifier} from '@gravity-ui/icons';

interface ListItemProps {
    item: PhrasesStats;
}

export const ListItem = ({item}: ListItemProps) => {
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
                <Button view="flat-warning">
                    <Icon data={Magnifier} />
                    {item.frequency}
                </Button>
            </div>
        </div>
    );
};
