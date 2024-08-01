import {Button, Icon, Select, Spin, Text} from '@gravity-ui/uikit';
import {ChevronDown, Key} from '@gravity-ui/icons';
import React, {useState} from 'react';
import callApi, {getUid} from 'src/utilities/callApi';
import {getNormalDateRange} from 'src/utilities/getRoundValue';
import {motion} from 'framer-motion';

export const CampaignSelect = ({
    selectValue,
    setSelectValue,
    selectOptions,
    dateRange,
    doc,
    setChangedDoc,
    recalc,
    filters,
    setPagesCurrent,
}) => {
    const [loading, setLoading] = useState(false);
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Select
                value={selectValue}
                placeholder="Values"
                options={selectOptions}
                renderControl={({onClick, onKeyDown, ref}) => {
                    return (
                        <Button
                            loading={loading}
                            ref={ref}
                            size="l"
                            view="action"
                            onClick={onClick}
                            extraProps={{
                                onKeyDown,
                            }}
                        >
                            <Icon data={Key} />
                            <Text variant="subheader-1">{selectValue[0]}</Text>
                            <Icon data={ChevronDown} />
                        </Button>
                    );
                }}
                onUpdate={(nextValue) => {
                    setLoading(true);

                    const params = {
                        uid: getUid(),
                        campaignName: nextValue[0],
                        dateRange: getNormalDateRange(dateRange),
                    };

                    if (!Object.keys(doc['analyticsData'][nextValue[0]]).length) {
                        callApi('getAnalytics', params, true).then((res) => {
                            if (!res) return;
                            const resData = res['data'];
                            doc['analyticsData'][nextValue[0]] =
                                resData['analyticsData'][nextValue[0]];
                            doc['plansData'][nextValue[0]] = resData['plansData'][nextValue[0]];

                            setChangedDoc(doc);
                            setSelectValue(nextValue);

                            setLoading(false);
                            console.log(doc);
                        });
                    } else {
                        setSelectValue(nextValue);
                        setLoading(false);
                    }
                    recalc(dateRange, nextValue[0], filters);
                    setPagesCurrent(1);
                }}
            />
            <motion.div
                style={{
                    overflow: 'hidden',
                }}
                animate={{
                    maxWidth: loading ? 40 : 0,
                    opacity: loading ? 1 : 0,
                }}
            >
                <Spin style={{marginTop: 4, marginLeft: 8}} />
            </motion.div>
        </div>
    );
};
