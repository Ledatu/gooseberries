import {Button, Icon, Modal, Text} from '@gravity-ui/uikit';
import axios from 'axios';
import React, {useEffect, useId, useState} from 'react';
import {FileArrowUp, TagRuble} from '@gravity-ui/icons';
import {RangeCalendar} from '@gravity-ui/date-components';
import {motion} from 'framer-motion';

export const AutoSalesUploadModal = ({params}) => {
    const {getUid, selectValue, setRefetchAutoSales} = params;

    const [autoSalesUploadModalOpen, setAutoSalesUploadModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dateRange, setDateRange] = useState([] as any[]);
    const [startDate, endDate] = dateRange;
    const [saleName, setSaleName] = useState('');
    const uploadId = useId();

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        setDateRange([]);
        setSaleName('');
        setCurrentStep(0);
        setUploadProgress(0);
    }, [autoSalesUploadModalOpen]);

    async function handleChange(event) {
        const file = event.target.files[0];

        if (!file) {
            setUploadProgress(-1);
            return;
        }

        const saleNameTemp = file.name.split('_')[5];
        setSaleName(saleNameTemp);
        if (!saleNameTemp) {
            setUploadProgress(-1);
            return;
        }

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
                setTimeout(() => {
                    setAutoSalesUploadModalOpen(false);
                    setUploadProgress(0);
                    setRefetchAutoSales(true);
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
        <div>
            <Button
                style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                size="l"
                view="action"
                onClick={() => {
                    setAutoSalesUploadModalOpen(true);
                }}
            >
                <Icon data={TagRuble} />
                <Text variant="subheader-1">Загрузить Автоакции</Text>
            </Button>
            <Modal
                open={autoSalesUploadModalOpen}
                onClose={() => {
                    setAutoSalesUploadModalOpen(false);
                }}
            >
                <motion.div
                    style={{
                        margin: 20,
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        animate={{height: currentStep < 3 ? 36 : 0}}
                        style={{height: 36, overflow: 'hidden'}}
                    >
                        <Button size="l" view="outlined" onClick={() => setCurrentStep(1)}>
                            <Text variant="subheader-1">
                                {startDate && endDate
                                    ? `${startDate.toLocaleDateString(
                                          'ru-RU',
                                      )} - ${endDate.toLocaleDateString('ru-RU')}`
                                    : 'Выберите даты автоакции'}
                            </Text>
                        </Button>
                    </motion.div>
                    <motion.div
                        animate={{height: currentStep == 1 ? 250 : 0}}
                        style={{
                            overflow: 'hidden',
                            height: 0,
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
                                setCurrentStep(2);
                            }}
                        />
                    </motion.div>
                    <motion.div
                        animate={{height: currentStep == 2 ? 44 : currentStep == 3 ? 80 : 0}}
                        style={{
                            height: 0,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end',
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
                                        setCurrentStep(3);
                                        setUploadProgress(0);
                                        (
                                            document.getElementById(uploadId) as HTMLInputElement
                                        ).value = '';
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
                    </motion.div>
                </motion.div>
            </Modal>
        </div>
    );
};
