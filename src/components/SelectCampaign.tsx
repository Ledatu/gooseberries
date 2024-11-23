import React, {useEffect, useMemo} from 'react';
import {Button, Icon, Select, Text} from '@gravity-ui/uikit';
import {Key, ChevronDown} from '@gravity-ui/icons';
import {useCampaign} from '../contexts/CampaignContext';
import {useUser} from './RequireAuth';

export const SelectCampaign = ({
    subscriptionExpDate,
    apiKeyExpDate,
    selectOptions,
}: {
    subscriptionExpDate: any;
    apiKeyExpDate: any;
    selectOptions: any[];
}) => {
    const {selectValue, setSelectValue, switchingCampaignsFlag, setSwitchingCampaignsFlag} =
        useCampaign();

    const {refetchUser} = useUser();

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

    const isMonthBeforeApiExp = useMemo(
        () => new Date(apiKeyExpDate).getTime() - new Date().getTime() < 86400 * 30 * 1000,
        [apiKeyExpDate],
    );

    useEffect(() => {
        if (
            selectValue[0] != '' &&
            selectOptions.length &&
            selectOptions.find((item) => item.content == selectValue[0])
        )
            return;
        setSelectValue([selectOptions?.[0]?.value]);
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
                                <Text color={isMonthBeforeApiExp ? 'danger' : undefined}>
                                    <Icon data={Key} />
                                </Text>
                                <div
                                    style={{
                                        margin: '0 8px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'start',
                                    }}
                                >
                                    {!selectValue[0] ? (
                                        <Text
                                            variant="subheader-1"
                                            style={{maxWidth: 200, overflow: 'hidden'}}
                                            ellipsis
                                        >
                                            Нет доступных магазинов
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                    <Text
                                        variant="subheader-1"
                                        style={{maxWidth: 170, overflow: 'hidden'}}
                                        ellipsis
                                    >
                                        {selectValue[0]}
                                    </Text>
                                    <Text variant="caption-2">
                                        {subscriptionExpDate &&
                                        subscriptionExpDate !== '2100-01-01T00:00:00.000Z'
                                            ? `Подписка до ${new Date(
                                                  subscriptionExpDate,
                                              ).toLocaleDateString('ru-RU')}`
                                            : selectValue[0]
                                            ? 'Бессрочная подписка'
                                            : 'Самое время добавить их!'}
                                    </Text>
                                    {isMonthBeforeApiExp ? (
                                        <Text
                                            variant="caption-2"
                                            color={isMonthBeforeApiExp ? 'danger' : undefined}
                                        >
                                            {`API до ${new Date(apiKeyExpDate).toLocaleDateString(
                                                'ru-RU',
                                            )}`}
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {selectOptions.length > 1 ? <Icon data={ChevronDown} /> : <></>}
                            </div>
                        </Button>
                    );
                }}
                onOpenChange={(open) => {
                    if (open) refetchUser();
                }}
                onUpdate={(nextValue) => {
                    setSwitchingCampaignsFlag(true);
                    setSelectValue(nextValue);
                }}
            />
        </div>
    );
};
