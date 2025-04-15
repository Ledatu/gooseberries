import {useUser} from '@/components/RequireAuth';
import {useEffect, useState} from 'react';
import callApi, {getUid} from '@/utilities/callApi';
import {getNormalDateRange} from '@/utilities/getRoundValue';

export const getUserDoc = (dateRange: any, docum = undefined, mode = false, selectValue = '') => {
    const {userInfo} = useUser();
    const {campaigns} = userInfo ?? {};
    const [doc, setDocument] = useState<any>();

    if (docum) {
        console.log(docum, mode, selectValue);

        if (mode) {
            doc['analyticsData'][selectValue] = docum['analyticsData'][selectValue];
            doc['plansData'][selectValue] = docum['plansData'][selectValue];
        }
        setDocument(docum);
    }

    useEffect(() => {
        callApi(
            'getAnalytics',
            {
                uid: getUid(),
                dateRange: getNormalDateRange(dateRange),
                campaignName: selectValue != '' ? selectValue : campaigns[0]?.name,
            },
            true,
        )
            .then((response) => {
                setDocument(response ? response['data'] : undefined);
            })
            .catch((error) => console.error(error));
    }, []);
    return doc;
};
