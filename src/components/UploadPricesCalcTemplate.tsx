import {Button, Icon, Text} from '@gravity-ui/uikit';
import {FileArrowUp} from '@gravity-ui/icons';
import React, {useId, useState} from 'react';
import {useError} from 'src/pages/ErrorContext';
import {uploadFile} from 'src/utilities/uploadFile';
import {getNormalDateRange} from 'src/utilities/getRoundValue';

export const UploadPricesCalcTemplate = ({
    sellerId,
    fixPrices,
    dateRange,
    parseResponse,
    setCurrentPricesCalculatedBasedOn,
    setOpen,
    setCalculatingFlag,
}) => {
    const {showError} = useError();
    const uploadId = useId();
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            console.error('No file selected');
            return;
        }

        const params = {
            seller_id: sellerId,
            fixPrices,
            dateRange: getNormalDateRange(dateRange),
        };

        console.log(params);

        setOpen(false);
        setCalculatingFlag(true);
        try {
            const response = await uploadFile(file, params, 'prices/calc-template');
            if (response) {
                parseResponse(response);
                setCurrentPricesCalculatedBasedOn('file');
            } else {
                console.error('No response from the API');
                showError('Не удалось рассчитать цены.');
            }
            console.log('Response:', response);
        } catch (error) {
            console.error('Error during file upload and calculation:', error);
            showError('Не удалось рассчитать цены.');
        }
        setCalculatingFlag(false);
    };

    return (
        <label style={{width: '100%'}} htmlFor={uploadId}>
            <Button
                width="max"
                size="l"
                onClick={() => {
                    setUploadProgress(0);
                    (document.getElementById(uploadId) as HTMLInputElement).value = '';
                }}
                style={{
                    position: 'relative',
                }}
                selected={uploadProgress === 100 || uploadProgress === -1}
                view={
                    uploadProgress === 100
                        ? 'flat-success'
                        : uploadProgress === -1
                        ? 'flat-danger'
                        : 'outlined-success'
                }
            >
                <Icon data={FileArrowUp} size={20} />{' '}
                <input
                    id={uploadId}
                    style={{
                        width: '100%',
                        opacity: 0,
                        position: 'absolute',
                        height: 40,
                        left: 0,
                        background: 'red',
                    }}
                    type="file"
                    accept=".xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleUpload}
                />
                <Text variant="subheader-1">Обработать шаблон цен</Text>
            </Button>
        </label>
    );
};
