import {useEffect, useState} from 'react';
import {AdvertDateData} from '../types/AdvertDateData';
import {AdvertStatsByDayModal} from './AdvertStatsByDayModal';
import {calcByDayStats} from '../hooks/calcByDayStatsForArt';
import {Button, Icon} from '@gravity-ui/uikit';
import {LayoutList} from '@gravity-ui/icons';

interface AdvertStatsByDayModalForNmIdProps {
    art: number;
    docCampaign: any;
    dateRange: [Date, Date];
}

export const AdvertStatsByDayModalForNmId = ({
    art,
    docCampaign,
    dateRange,
}: AdvertStatsByDayModalForNmIdProps) => {
    const [data, setData] = useState<AdvertDateData[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            const temp = calcByDayStats(art, dateRange, docCampaign);
            console.log(temp);
            setData(temp);
        }
    }, [open]);
    return (
        <AdvertStatsByDayModal
            open={open}
            setOpen={setOpen}
            data={data}
            customButton={({onClick}) => (
                <Button
                    pin="brick-brick"
                    view="outlined"
                    size="xs"
                    onClick={onClick}
                >
                    <Icon data={LayoutList}></Icon>
                </Button>
            )}
        />
    );
};
