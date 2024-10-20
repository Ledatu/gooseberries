import React, {useEffect, useMemo} from 'react';
import {Button, Icon, Select, Text} from '@gravity-ui/uikit';
import {Key, ChevronDown} from '@gravity-ui/icons';
import {useCampaign} from '../contexts/CampaignContext';

export const SelectCampaign = ({
    subscriptionExpDate,
    selectOptions,
}: {
    subscriptionExpDate: any;
    selectOptions: any[];
}) => {
    const {selectValue, setSelectValue, switchingCampaignsFlag, setSwitchingCampaignsFlag} =
        useCampaign();

    const isWeekOrLessUntillExp = useMemo(() => {
        if (!subscriptionExpDate) return false;

        const date = new Date(subscriptionExpDate);
        if (!date) return true;

        date.setHours(23, 59, 59, 999);
        date.setDate(date.getDate() - 8);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return date.getTime() - today.getTime() <= 10;
    }, [subscriptionExpDate]);

    useEffect(() => {
        if (!selectOptions || !selectOptions.length || selectValue[0] != '') return;
        setSelectValue([selectOptions[0]?.value]);
    }, [selectOptions]);

    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Select
                value={selectValue}
                placeholder="Values"
                options={selectOptions}
                renderControl={({onClick, onKeyDown, ref}) => {
                    return (
                        <Button
                            view={isWeekOrLessUntillExp ? 'flat-danger' : 'flat'}
                            pin="brick-brick"
                            style={{height: 68}}
                            loading={switchingCampaignsFlag}
                            ref={ref}
                            onClick={onClick}
                            extraProps={{
                                onKeyDown,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon data={Key} />
                                <div
                                    style={{
                                        margin: '0 8px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'start',
                                    }}
                                >
                                    <Text variant="subheader-1">{selectValue[0]}</Text>
                                    <Text variant="caption-2">
                                        {subscriptionExpDate &&
                                        subscriptionExpDate !== '2100-01-01T00:00:00.000Z'
                                            ? `Подписка до ${new Date(
                                                  subscriptionExpDate,
                                              ).toLocaleDateString('ru-RU')}`
                                            : 'Бессрочная подписка'}
                                    </Text>
                                </div>
                                <Icon data={ChevronDown} />
                            </div>
                        </Button>
                    );
                }}
                onUpdate={(nextValue) => {
                    setSwitchingCampaignsFlag(true);
                    setSelectValue(nextValue);
                }}
            />
        </div>
    );
};
