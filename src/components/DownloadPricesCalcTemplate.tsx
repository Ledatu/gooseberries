import {Button, Icon, Text} from '@gravity-ui/uikit';
import {FileArrowDown} from '@gravity-ui/icons';
import React from 'react';
import {useCampaign} from 'src/contexts/CampaignContext';
import {useError} from 'src/pages/ErrorContext';
import callApi from 'src/utilities/callApi';

export const DownloadPricesCalcTemplate = ({sellerId, mode, filteredData}) => {
    const {selectValue} = useCampaign();
    const {showError} = useError();
    return (
        <Button
            size="l"
            width="max"
            view={'outlined-warning'}
            onClick={() => {
                const params = {seller_id: sellerId, mode, nmIds: [] as number[]};
                for (const row of filteredData) {
                    const {nmId} = row;
                    if (!params.nmIds.includes(nmId)) params.nmIds.push(nmId);
                }
                console.log(params);
                callApi('downloadPricesCalcTemplate', params)
                    .then((res: any) => {
                        const element = document.createElement('a');
                        element.href = URL.createObjectURL(res?.data);
                        element.download = `Шаблон цен ${selectValue[0]}.xlsx`;
                        // simulate link click
                        document.body.appendChild(element);
                        element.click();
                    })
                    .catch(() => {
                        showError('Не удалось скачать шаблон цен.');
                    });
            }}
        >
            <Icon data={FileArrowDown} size={20} />
            <Text variant="subheader-1">Скачать шаблон цен</Text>
        </Button>
    );
};
