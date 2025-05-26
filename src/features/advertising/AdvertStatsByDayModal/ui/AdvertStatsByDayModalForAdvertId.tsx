import {useCampaign} from '@/contexts/CampaignContext';
import {getStatsByDateForAdvertId} from '../api/getStatsByDateForAdvertId';
import {useEffect, useState} from 'react';
import {advertDateDataFromDTO} from '../hooks/advertDateDataFromDTO';
import {AdvertDateData} from '../types/AdvertDateData';
import {AdvertStatsByDayModal} from './AdvertStatsByDayModal';
import {getStatsForAdvertForDate} from '../api/getStatsForAdvertForDate';
import {getLocaleDateString} from '@/utilities/getRoundValue';
import {getSeparetedData} from '../hooks/getSeparetedData';

interface AdvertStatsByDayModalForAdvertIdProps {
    advertId: number;
    arts: string[];
    docCampaign: any;
}

export const AdvertStatsByDayModalForAdvertId = ({
    advertId,
    arts,
    docCampaign,
}: AdvertStatsByDayModalForAdvertIdProps) => {
    const [data, setData] = useState<AdvertDateData[]>([]);
    const [open, setOpen] = useState(false);
    const [separetedData, setSeparetedData] = useState<
        Record<string, {catalogStats: AdvertDateData; searchStats: AdvertDateData}>
    >({});
    const handleButtonClick = async (date: Date) => {
        try {
            const dateString = getLocaleDateString(date);
            if (separetedData[dateString]) {
                delete separetedData[dateString];
                setSeparetedData({...separetedData})
            } else {
                const res = await getStatsForAdvertForDate(sellerId, date, advertId);
                console.log(res);
                const dataOfDate = data.filter((a) => getLocaleDateString(a.date) == res.date)[0];
                if (dataOfDate) {
                    const newSeparetedData = getSeparetedData(res.stats, dataOfDate);
                    console.log(newSeparetedData);
                    separetedData[dateString] = newSeparetedData;
                    setSeparetedData({...separetedData});
                }
                setData(data);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        console.log(separetedData);
    }, [separetedData]);
    const {sellerId} = useCampaign();
    const getData = async () => {
        try {
            const stats = await getStatsByDateForAdvertId(sellerId, advertId);
            const tempData = advertDateDataFromDTO(stats, docCampaign, arts);
            setData(tempData);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (open) {
            getData();
        }
    }, [open]);

    return (
        <AdvertStatsByDayModal
            open={open}
            setOpen={setOpen}
            data={data}
            additionalInfo={separetedData}
            handleClickDetailedInfoButton={handleButtonClick}
        />
    );
};
