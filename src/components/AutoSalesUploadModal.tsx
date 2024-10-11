import {Button, Icon, Text} from '@gravity-ui/uikit';
import axios from 'axios';
import React, {useEffect, useId, useState} from 'react';
import {FileArrowUp} from '@gravity-ui/icons';
import {getUid} from 'src/utilities/callApi';
import {useUser} from './RequireAuth';

export const AutoSalesUploadModal = ({selectValue, sellerId, uploaded, setUploaded, promotion}) => {
    const {userInfo} = useUser();
    const {user} = userInfo;

    const [uploadProgress, setUploadProgress] = useState(0);
    const dateRange = [new Date(promotion?.startDateTime), new Date(promotion?.endDateTime)];
    const [startDate, endDate] = dateRange;
    const uploadId = useId();

    useEffect(() => {
        setUploadProgress(0);
    }, [uploaded]);

    async function handleChange(event) {
        const file = event.target.files[0];

        if (!file) {
            setUploadProgress(-1);
            return;
        }

        event.preventDefault();
        const url = 'https://aurum-mp.ru/api/uploadAutoSales';
        const formData = new FormData();

        formData.append('uid', getUid());
        formData.append('campaignName', selectValue[0]);
        formData.append('seller_id', sellerId);
        formData.append('promotion_id', promotion?.id);
        formData.append('autoSaleName', promotion?.name);
        formData.append('username', user?.username);
        formData.append('user_id', user?.id);
        formData.append('dateRange', JSON.stringify(dateRange));
        formData.append('file', file);

        const config = {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs`,
            },
            onUploadProgress: function (progressEvent) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                );
                setUploadProgress(percentCompleted);
            },
        };

        try {
            const response = await axios.post(url, formData, config);
            if (response) {
                setTimeout(() => {
                    setUploaded(true);
                }, 1 * 1000);
            }
        } catch (error) {
            setUploadProgress(-1);
            console.error('Error uploading file: ', error);
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Request data:', error.request);
            } else {
                // Something happened in setting up the request
                console.error('Error message:', error.message);
            }

            // Capture detailed error for debugging
            console.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                config: error.config,
                code: error.code,
                status: error.response ? error.response.status : null,
            });
        }
    }

    return (
        <form encType="multipart/form-data" style={{width: '100%'}}>
            <label htmlFor={uploadId} style={{width: '100%'}}>
                <Button
                    width="max"
                    disabled={!startDate || !endDate}
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
                        justifyContent: 'center',
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
                            width: '100%',
                        }}
                    >
                        <Icon data={FileArrowUp} size={20} />
                        <div style={{minWidth: 3}} />
                        Загрузить файл акции
                        {!startDate || !endDate ? (
                            <></>
                        ) : (
                            <input
                                id={uploadId}
                                style={{
                                    opacity: 0,
                                    position: 'absolute',
                                    height: 40,
                                    left: 0,
                                }}
                                type="file"
                                accept=".xls,.xlsx"
                                onChange={handleChange}
                            />
                        )}
                    </Text>
                </Button>
            </label>
        </form>
    );
};
