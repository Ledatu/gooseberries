import Userfront from '@userfront/toolkit';
import axios from 'axios';

const {ipAddress} = require('../ipAddress');

export default function callApi(endpoint: string, params: object) {
    return new Promise((resolve) => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
        axios
            .post(`${ipAddress}/api/${endpoint}`, params, {
                responseType: endpoint.includes('download') ? 'blob' : undefined,
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => resolve(response))
            .catch((error) => {
                console.error('API call failed:', error);
                resolve(undefined);
            });
    });
}

export const getUid = () => {
    return [
        '4a1f2828-9a1e-4bbf-8e07-208ba676a806',
        '46431a09-85c3-4703-8246-d1b5c9e52594',
        // '1c5a0344-31ea-469e-945e-1dfc4b964ecd',
        '453a2da6-9458-44bd-b756-0282fbb7557d',
    ].includes(Userfront.user.userUuid ?? '')
        ? '4a1f2828-9a1e-4bbf-8e07-208ba676a806_1'
        : '';
};
