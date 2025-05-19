import {useCampaign} from '@/contexts/CampaignContext';
import {useEffect, useMemo, useState} from 'react';

export const useCheckboxes = (filteredData: any[], filters: any, key: string) => {
    const {sellerId} = useCampaign();

    const [checkboxStates, setCheckboxStates] = useState({} as any);
    const checkboxHeaderState = useMemo(() => {
        const values = Object.values(checkboxStates);
        if (values.length != filteredData?.length || !filteredData?.length) return false;
        return values.every((value) => value === true);
    }, [checkboxStates]);

    useEffect(() => {
        setCheckboxStates({});
        console.log('set state checks to default');
    }, [filteredData?.length, filters, sellerId]);

    const updateCheckbox = (keyVal: string) => {
        checkboxStates[keyVal] = checkboxStates[keyVal] ? false : true;
        setCheckboxStates({...checkboxStates});
    };
    const updateHeaderCheckbox = () => {
        if (checkboxHeaderState) setCheckboxStates({});
        else if (filteredData?.length)
            setCheckboxStates(Object.fromEntries(filteredData?.map((row) => [row?.[key], true])));
    };

    return {
        updateCheckbox,
        updateHeaderCheckbox,
        checkboxHeaderState,
        checkboxStates,
    };
};
