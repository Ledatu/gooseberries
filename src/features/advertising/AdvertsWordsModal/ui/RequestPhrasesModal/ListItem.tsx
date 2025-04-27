import {ActionTooltip, Button, Icon, Text} from '@gravity-ui/uikit';
import {PhrasesStats} from '../../types/PhraseStats';
import {Eye, Magnifier} from '@gravity-ui/icons';
import {motion} from 'framer-motion';

interface ListItemProps {
    item: PhrasesStats;
    showViews?: boolean;
    showFrequncy?: boolean;
}

export const ListItem = ({item, showViews = true, showFrequncy = true}: ListItemProps) => {
    return (
        <motion.div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                padding: 8,
                width: '100%',
                justifyContent: 'space-between',
            }}
            // initial={{opacity: 0, y: 15}}
            // animate={{opacity: 1, y: 0}}
            // exit={{opacity: 0, y: 15}}
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
        </motion.div>
    );
};
