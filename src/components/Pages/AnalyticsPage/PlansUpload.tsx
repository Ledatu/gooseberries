'use client';

import {Button, Icon, Text} from '@gravity-ui/uikit';
import {FileArrowUp} from '@gravity-ui/icons';
import {useId, useState} from 'react';
import {getUid} from '@/utilities/callApi';
import axios from 'axios';

interface PlansUploadProps {
    selectValue: string[];
    doc: any;
    setChangedDoc: (args?: any) => any;
    disabled: boolean;
}
export const PlansUpload = ({selectValue, doc, setChangedDoc, disabled}: PlansUploadProps) => {
    const uploadId = useId();
    const [uploadProgress, setUploadProgress] = useState(0);

    async function handleChange(event: any) {
        const file = event.target.files[0];

        if (!file || !file.name.includes('.xlsx')) {
            setUploadProgress(-1);
            return;
        }

        event.preventDefault();
        const url = 'https://seller.aurum-sky.net/backend/uploadPlans';
        const formData = new FormData();

        formData.append('uid', getUid());
        formData.append('campaignName', selectValue[0]);
        formData.append('file', file);

        for (const value of formData.values()) {
            console.log(value);
        }

        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            onUploadProgress: function (progressEvent: any) {
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
                const resData = response['data'];
                doc['plansData'][selectValue[0]] = resData;
                setChangedDoc({...doc});

                setTimeout(() => {
                    setUploadProgress(0);
                }, 5 * 1000);
            }
        } catch (error: any) {
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
        <label htmlFor={uploadId}>
            <Button
                disabled={disabled}
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
                    Загрузить планы
                    <input
                        disabled={disabled}
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
    );
};
