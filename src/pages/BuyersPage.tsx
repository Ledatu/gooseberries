import React, {useEffect, useState} from 'react';
import {RadioButton} from '@gravity-ui/uikit';
import {BuyersFeedbacksPage} from 'src/components/BuyersFeedbacksPage';
import {AutoFeedbackAnsweringPage} from 'src/components/AutoFeedbackAnsweringPage';
import {AutoFeedbackTemplateCreationModal} from 'src/components/AutoFeedbackTemplateCreationModal';

export const BuyersPage = ({
    selectValue,
    sellerId,
    setSwitchingCampaignsFlag,
}: {
    selectValue: string[];
    sellerId: string;
    setSwitchingCampaignsFlag: Function;
}) => {
    const sectionOptions = [
        {content: 'Необработанные отзывы', value: 'feedbacksUnanswered'},
        {content: 'Обработанные отзывы', value: 'feedbacksAnswered'},
        {content: 'Автоответы', value: 'automation'},
    ];
    const [selectedPage, setSelectedPage] = useState(sectionOptions[0].value);

    useEffect(() => {
        setSwitchingCampaignsFlag(false);
    }, [selectValue]);

    const [refetch, setRefetch] = useState(false);

    const pagesMap = {
        feedbacksUnanswered: {
            page: (
                <BuyersFeedbacksPage
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
            page: <AutoFeedbackAnsweringPage selectValue={selectValue} refetch={refetch} />,
            additionalNodes: (
                <AutoFeedbackTemplateCreationModal
                    sellerId={sellerId}
                    selectValue={selectValue}
                    setRefetch={setRefetch}
                />
            ),
        },
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                {pagesMap[selectedPage]?.additionalNodes}
                <RadioButton
                    style={{marginBottom: 8}}
                    value={selectedPage}
                    onUpdate={(val) => setSelectedPage(val)}
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
