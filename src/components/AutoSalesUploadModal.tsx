import {Button, Card, Icon, Modal, Text} from '@gravity-ui/uikit';
import axios from 'axios';
import React, {useEffect, useId, useState} from 'react';
import {FileArrowUp} from '@gravity-ui/icons';
import {RangeCalendar} from '@gravity-ui/date-components';

export const AutoSalesUploadModal = ({params}) => {
    const {autoSalesUploadModalOpen, setAutoSalesUploadModalOpen, getUid, selectValue} = params;

    const [uploadProgress, setUploadProgress] = useState(0);
    const [dateRange, setDateRange] = useState([] as any[]);
    const [startDate, endDate] = dateRange;
    const [saleName, setSaleName] = useState('');
    const uploadId = useId();

    useEffect(() => {
        setDateRange([]);
        setSaleName('');
    }, [autoSalesUploadModalOpen]);

    async function handleChange(event) {
        const file = event.target.files[0];

        if (!file || !file.name.includes('.xlsx')) {
            setUploadProgress(-1);
            return;
        }

        const saleNameTemp = file.name.split('_')[5];
        setSaleName(saleNameTemp);

        event.preventDefault();
        const url = 'https://aurum-mp.ru/api/uploadAutoSales';
        const formData = new FormData();

        formData.append('uid', getUid());
        formData.append('campaignName', selectValue[0]);
        formData.append('autoSaleName', saleNameTemp);
        formData.append('dateRange', JSON.stringify(dateRange));
        formData.append('file', file);

        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
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
            console.log(response.data);
            if (response) {
                setAutoSalesUploadModalOpen(false);
                setTimeout(() => {
                    setUploadProgress(0);
                }, 5 * 1000);
            }
            event.target.files = [];
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
        <Modal
            open={autoSalesUploadModalOpen}
            onClose={() => {
                setAutoSalesUploadModalOpen(false);
            }}
        >
            <Card
                view="clear"
                style={{
                    margin: 20,
                    flexWrap: 'nowrap',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'none',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text variant="header-1">{saleName}</Text>
                    <div style={{minHeight: 8}} />
                    <form encType="multipart/form-data">
                        <label htmlFor={uploadId}>
                            <Button
                                disabled={!startDate || !endDate}
                                size="l"
                                onClick={() => {
                                    setUploadProgress(0);
                                    (document.getElementById(uploadId) as HTMLInputElement).value =
                                        '';
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
                                    Загрузить файл автоакции
                                    <input
                                        id={uploadId}
                                        style={{
                                            opacity: 0,
                                            position: 'absolute',
                                            height: 40,
                                            left: 0,
                                        }}
                                        type="file"
                                        onChange={handleChange}
                                    />
                                </Text>
                            </Button>
                        </label>
                    </form>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <RangeCalendar
                        size="m"
                        timeZone="Europe/Moscow"
                        onUpdate={(val) => {
                            const range = [val.start.toDate(), val.end.toDate()];
                            setDateRange(range);
                        }}
                    />
                    <Text variant="subheader-2" color={startDate && endDate ? 'primary' : 'danger'}>
                        {startDate && endDate
                            ? `${startDate.toLocaleDateString(
                                  'ru-RU',
                              )} - ${endDate.toLocaleDateString('ru-RU')}`
                            : 'Выберите даты автоакции'}
                    </Text>
                </div>
            </Card>
        </Modal>
    );
};
