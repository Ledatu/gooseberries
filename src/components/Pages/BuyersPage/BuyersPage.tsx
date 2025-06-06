'use client';

import {useEffect, useMemo, useState} from 'react';
// import {RadioButton} from '@gravity-ui/uikit';
import {BuyersFeedbacksPage} from './BuyersFeedbacksPage';
import {AutoFeedbackAnsweringPage} from './AutoFeedbackAnsweringPage';
import {useCampaign} from '@/contexts/CampaignContext';
import {useModules} from '@/contexts/ModuleProvider';
import { SegmentedRadioGroup } from '@gravity-ui/uikit';

export const BuyersPage = () => {
    const {selectValue, setSwitchingCampaignsFlag, sellerId} = useCampaign();
    const {availablemodulesMap} = useModules();
    const permission: string = useMemo(() => {
        return availablemodulesMap['buyers'];
    }, [availablemodulesMap]);

    const sectionOptions = [
        {content: 'Необработанные отзывы', value: 'feedbacksUnanswered'},
        {content: 'Обработанные отзывы', value: 'feedbacksAnswered'},
    ].concat(permission != 'Управление' ? [] : [{content: 'Шаблоны', value: 'automation'}]);
    const [selectedPage, setSelectedPage] = useState(sectionOptions[0].value);

    useEffect(() => {
        setSwitchingCampaignsFlag(false);
    }, [selectValue]);

    const pagesMap: any = {
        feedbacksUnanswered: {
            page: (
                <BuyersFeedbacksPage
                    permission={permission}
                    isAnswered="notAnswered"
                    sellerId={sellerId}
                    selectValue={selectValue}
                />
            ),
            additionalNodes: <div />,
        },
        feedbacksAnswered: {
            page: (
                <BuyersFeedbacksPage
                    permission={permission}
                    isAnswered="answered"
                    sellerId={sellerId}
                    selectValue={selectValue}
                />
            ),
            additionalNodes: <div />,
        },
        questions: {
            page: <div />,
            additionalNodes: <div />,
        },
        automation: {
            page: <AutoFeedbackAnsweringPage sellerId={sellerId} selectValue={selectValue} />,
            additionalNodes: <div />,
        },
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: 'calc(100vh - 10em - 100px)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                {pagesMap[selectedPage]?.additionalNodes}
                <SegmentedRadioGroup
                    style={{marginBottom: 8}}
                    value={selectedPage}
                    onUpdate={(val: any) => setSelectedPage(val)}
                    options={sectionOptions}
                    size="l"
                />
            </div>
            <div style={{minHeight: 4}} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {pagesMap[selectedPage]?.page}
            </div>
        </div>
    );
};
