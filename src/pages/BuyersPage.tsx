import React, {useEffect} from 'react';
import {User} from './Dashboard';
import {RadioButton} from '@gravity-ui/uikit';

export const BuyersPage = ({
    selectValue,
    setSwitchingCampaignsFlag,
    userInfo,
}: {
    selectValue: string[];
    setSwitchingCampaignsFlag: Function;
    userInfo: User;
}) => {
    const sectionOptions = [
        {content: 'Отзывы', value: 'feedbacks'},
        {content: 'Вопросы', value: 'questions'},
        {content: 'Автоответы', value: 'automation'},
    ];

    useEffect(() => {
        setSwitchingCampaignsFlag(false);
        console.log(userInfo);
    }, [selectValue]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'end',
                }}
            >
                <RadioButton options={sectionOptions} size="l" />
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
            ></div>
        </div>
    );
};
