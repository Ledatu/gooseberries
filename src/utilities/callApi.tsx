import Userfront from '@userfront/toolkit';
import axios from 'axios';

const {ipAddress} = require('../ipAddress');

export default async function callApi(
    endpoint,
    params,
    retry = false,
    thr = false,
    cancelToken = null as any,
) {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
    const maxRetries = retry ? 5 : 1;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await axios.post(`${ipAddress}/api/${endpoint}`, params, {
                responseType: endpoint.includes('download') ? 'blob' : undefined,
                headers: {
                    Authorization: 'Bearer ' + token,
                },
                cancelToken, // Pass the cancel token to Axios
            });
            return response;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
                return undefined;
            }
            console.error(`API call failed on attempt ${attempt + 1}:`, error);
            if (attempt < maxRetries - 1) {
                await delay(3000);
            } else {
                if (thr) throw new Error(error);
                return undefined;
            }
        }
    }
    return undefined;
}

export const getUid = () => {
    return `4a1f2828-9a1e-4bbf-8e07-208ba676a806_${Userfront.user.userUuid}`;
};
