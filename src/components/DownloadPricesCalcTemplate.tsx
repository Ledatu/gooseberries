import {Button, Icon, Text} from '@gravity-ui/uikit';
import {FileArrowDown} from '@gravity-ui/icons';
import React from 'react';
import {useError} from 'src/pages/ErrorContext';
import ApiClient from 'src/utilities/ApiClient';
import {useCampaign} from 'src/contexts/CampaignContext';

export const DownloadPricesCalcTemplate = ({sellerId, mode, filteredData}) => {
    const {showError} = useError();
    const {selectValue} = useCampaign();

    const downloadPricesTemplate = async () => {
        try {
            const params = {seller_id: sellerId, data: {mode, nmIds: [] as number[]}};
            for (const row of filteredData) {
                const {nmId} = row;
                if (!params.data.nmIds.includes(nmId)) params.data.nmIds.push(nmId);
            }

            console.log(params);

            const response = await ApiClient.post('prices/download-template', params, 'blob');
            if (response && response.data) {
                const element = document.createElement('a');
                element.href = URL.createObjectURL(response.data);
                element.download = `Шаблон цен ${selectValue[0]}.xlsx`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            } else {
                console.error('No data received from the API');
            }
        } catch (error) {
            console.error(error);
            showError('Не удалось скачать шаблон цен.');
        }
    };

    return (
        <Button size="l" width="max" view={'outlined-warning'} onClick={downloadPricesTemplate}>
            <Icon data={FileArrowDown} size={20} />
            <Text variant="subheader-1">Скачать шаблон цен</Text>
        </Button>
    );
};
