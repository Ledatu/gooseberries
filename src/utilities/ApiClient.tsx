// ApiClient.tsx
'use client';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const ipAddress = 'https://seller.aurum-sky.net';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getAuthToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    async get(
        endpoint: string,
        params: any = {},
        retry = false,
        cancelToken: any = null
    ): Promise<AxiosResponse<any> | undefined> {
        return this.request(endpoint, 'get', params, 'json', retry, cancelToken);
    }

    async post(
        endpoint: string,
        params: any = {},
        responseType: 'json' | 'blob' = 'json',
        retry = false,
        cancelToken: any = null,
        additionalConfig: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<any> | undefined> {
        return this.request(
            endpoint,
            'post',
            params,
            responseType,
            retry,
            cancelToken,
            additionalConfig
        );
    }

    private async request(
        endpoint: string,
        method: 'get' | 'post',
        params: any = {},
        responseType: 'json' | 'blob' = 'json',
        retry = false,
        cancelToken: any = null,
        additionalConfig: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<any> | undefined> {
        const maxRetries = retry ? 5 : 1;
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const authToken = this.getAuthToken();
        const authHeader = authToken ? `Bearer ${authToken}` : undefined;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const config: AxiosRequestConfig = {
                    url: `${this.baseUrl}/backend/${endpoint}`,
                    method,
                    headers: {
                        ...(authHeader ? { Authorization: authHeader } : {}),
                        ...additionalConfig.headers,
                    },
                    responseType,
                    cancelToken,
                    ...additionalConfig,
                };

                if (method === 'get') {
                    config.params = params;
                } else {
                    config.data = params;
                }

                const response = await axios(config);
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
                    throw error;
                }
            }
        }

        return undefined;
    }
}

export default new ApiClient(ipAddress);
