import {Button, Icon, Text} from '@gravity-ui/uikit';
import {FileArrowDown} from '@gravity-ui/icons';
import {useError} from '@/contexts/ErrorContext';
import ApiClient from '@/utilities/ApiClient';
import {useCampaign} from '@/contexts/CampaignContext';

interface DownloadNomenclaturesTemplateProps {
    sellerId: string
}

export const DownloadNomenclaturesTemplate = ({sellerId} : DownloadNomenclaturesTemplateProps) => {
    const {showError} = useError();
    const {selectValue} = useCampaign();

    const downloadPricesTemplate = async () => {
        try {
            const params = {seller_id: sellerId};

            const response = await ApiClient.post(
                'nomenclatures/download-template',
                params,
                'blob',
            );
            if (response && response.data) {
                const element = document.createElement('a');
                element.href = URL.createObjectURL(response.data);
                element.download = `Информация о товарах ${selectValue[0]}.xlsx`;
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
            <Text variant="subheader-1">Скачать информацию о товарах</Text>
        </Button>
    );
};
