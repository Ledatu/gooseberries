'use client';

import {useEffect, useMemo} from 'react';
import {Button, Icon, Select, Text} from '@gravity-ui/uikit';
import {Key, ChevronDown} from '@gravity-ui/icons';
import {useCampaign} from '@/contexts/CampaignContext';
import {useSearchParams} from 'next/navigation';
import {useUser} from '../RequireAuth';

export const SelectCampaign = ({
    subscriptionExpDate,
    apiKeyExpDate,
    selectOptions,
}: {
    subscriptionExpDate: any;
    apiKeyExpDate: any;
    selectOptions: any[];
}) => {
    const {selectValue, switchingCampaignsFlag, setSwitchingCampaignsFlag, setSellerId} =
        useCampaign();

    const searchParams = useSearchParams();

    // const createQueryString = useCallback(
    //     (name: string, value: string) => {
    //         const params = new URLSearchParams(searchParams.toString());
    //         params.set(name, value);

    //         return params.toString();
    //     },
    //     [searchParams],
    // );
    const {refetchUser} = useUser();
    // const {campaigns} = userInfo ?? [];

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
    // useEffect(() => {

    //     console.log(JSON.stringify(campaigns));
    //     if (
    //         selectValue[0] != '' &&
    //         selectOptions.length &&
    //         selectOptions.find((item) => item.content == selectValue[0])
    //     )
    //         return;
    //     // router.push(createQueryString('seller_id', selectOptions?.[0]?.value));
    //     // setSelectValue([selectOptions?.[0]?.content]);
    //     // setSellerId(selectOptions?.[0]?.value);
    //     // setCampaignInfo(findCampaignBySellerId(selectOptions?.[0]?.value));
    //     // router.push(`/${selectOptions?.[0]?.value}`, { shallow: true });
    //     // route.push(`/${selectOptions?.[0]?.value}`);
    // }, [selectOptions]);
    useEffect(() => {
        if (!selectOptions.length) return;

        const urlSellerId = searchParams.get('seller_id');
        const isValidInitial = selectOptions.some((opt) => opt.value === urlSellerId);

        // Only update if URL param is invalid/missing
        if (!isValidInitial) {
            const initialValue = selectOptions[0];
            // const newParams = new URLSearchParams(searchParams.toString());

            // Use replace instead of push to prevent history entry

            // Directly update context state
            // setSelectValue([initialValue.content]);
            setSellerId(initialValue.value);
        }
    }, [selectOptions]); // Keep selectOptions as dep
    useEffect(() => {
        if (!selectOptions.length) return;

        // Find valid initial value
        const initialValue =
            selectOptions.find((item) => item.value === searchParams.get('seller_id')) ||
            selectOptions[0];

        if (initialValue) {
            // setSelectValue([initialValue.content]);
            setSellerId(initialValue.value);
            // window.history.pushState(
            //     null,
            //     '',
            //     `?${createQueryString('seller_id', initialValue.value)}`,
            // );
            // //   router.push(`?${createQueryString('seller_id', initialValue.value)}`);
        }
    }, [selectOptions]);

    const handleUpdate = (nextValue: string[]) => {
        const currentSellerId = searchParams.get('seller_id');
        const newSellerId = nextValue[0];

        if (currentSellerId !== newSellerId) {
            setSwitchingCampaignsFlag(true);
            setSellerId(newSellerId);
            // window.history.pushState(null, '', `?${createQueryString('seller_id', newSellerId)}`);
            // router.push(`?${createQueryString('seller_id', newSellerId)}`);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                // alignItems: 'center',
                // justifyContent: 'center',
            }}
        >
            <Select
                value={selectValue}
                placeholder="Values"
                options={selectOptions}
                filterable={true}
                renderControl={({triggerProps: {onClick, onKeyDown}}) => {
                    return (
                        <Button
                            // ref={ref as Ref<HTMLButtonElement>}
                            view={isWeekOrLessUntillExp ? 'flat-danger' : 'flat'}
                            pin="brick-brick"
                            style={{height: 68, alignItems: 'center'}}
                            loading={switchingCampaignsFlag}
                            // ref={ref}
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
                    console.log('refetchUser from select campaign');
                }}
                onUpdate={(nextValue) => {
                    handleUpdate(nextValue);
                    // setSwitchingCampaignsFlag(true);
                    // router.push(createQueryString('seller_id', nextValue[0]));
                }}
            />
        </div>
    );
};
