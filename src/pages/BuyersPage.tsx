import React, {useEffect, useState} from 'react';
import {RadioButton} from '@gravity-ui/uikit';
import {BuyersFeedbacksPage} from 'src/components/BuyersFeedbacksPage';
import {AutoFeedbackAnsweringPage} from 'src/components/AutoFeedbackAnsweringPage';
import {AutoFeedbackTemplateCreationModal} from 'src/components/AutoFeedbackTemplateCreationModal';

export const BuyersPage = ({
    selectValue,
    setSwitchingCampaignsFlag,
}: {
    selectValue: string[];
    setSwitchingCampaignsFlag: Function;
}) => {
    const sectionOptions = [
        {content: 'Отзывы', value: 'feedbacks'},
        {content: 'Вопросы', value: 'questions'},
        {content: 'Автоответы', value: 'automation'},
    ];
    const [selectedPage, setSelectedPage] = useState(sectionOptions[0].value);

    useEffect(() => {
        setSwitchingCampaignsFlag(false);
    }, [selectValue]);

    const [refetch, setRefetch] = useState(false);

    const pagesMap = {
        feedbacks: {
            page: <BuyersFeedbacksPage selectValue={selectValue} />,
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
                    value={selectedPage}
                    onUpdate={(val) => setSelectedPage(val)}
                    options={sectionOptions}
                    size="l"
                />
            </div>
            <div style={{minHeight: 16}} />
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
