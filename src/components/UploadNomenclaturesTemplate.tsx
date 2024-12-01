import {Button, Icon, Text} from '@gravity-ui/uikit';
import {FileArrowUp} from '@gravity-ui/icons';
import React, {useId, useState} from 'react';
import {useError} from 'src/pages/ErrorContext';
import {uploadFile} from 'src/utilities/uploadFile';

export const UploadNomenclaturesTemplate = ({sellerId, setUpdate}) => {
    const {showError} = useError();
    const uploadId = useId();
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            console.error('No file selected');
            return;
        }

        const params = {seller_id: sellerId};

        console.log(params);

        try {
            const response = await uploadFile(file, params, 'nomenclatures/parse-template');
            if (response) {
                setUpdate(true);
            } else {
                console.error('No response from the API');
                showError('Не удалось обработать файл.');
            }
            console.log('Response:', response);
        } catch (error) {
            console.error('Error during file upload and parsing:', error);
            showError('Не удалось обработать файл.');
        }
    };

    return (
        <label htmlFor={uploadId}>
            <Button
                size="l"
                onClick={() => {
                    setUploadProgress(0);
                    (document.getElementById(uploadId) as HTMLInputElement).value = '';
                }}
                style={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
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
                <Text
                    variant="subheader-1"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Icon data={FileArrowUp} size={20} />
                    <div style={{minWidth: 3}} />
                    Обработать информацию о товарах
                    <input
                        id={uploadId}
                        style={{
                            width: '100%',
                            opacity: 0,
                            position: 'absolute',
                            height: 40,
                            left: 0,
                        }}
                        type="file"
                        accept=".xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleUpload}
                    />
                </Text>
            </Button>
        </label>
    );
};
