import {Button, Icon, Text} from '@gravity-ui/uikit';
import {PhrasesStats} from '../../api/PhraseStats';
import {Eye, Magnifier} from '@gravity-ui/icons';

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
            <Text style={{alignContent: 'center'}}>{item.keyword}</Text>
            <div style={{display: 'flex', flexDirection: 'row', gap: 8, padding: 8}}>
                <Button view="flat-warning">
                    <Icon data={Eye} />
                    {item.views}
                </Button>
                <Button view="flat-warning">
                    <Icon data={Magnifier} />
                    {item.frequency}
                </Button>
            </div>
        </div>
    );
};
