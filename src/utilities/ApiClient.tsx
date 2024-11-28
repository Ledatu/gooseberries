// ApiClient.tsx
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

const {ipAddress} = require('../ipAddress');

class ApiClient {
    private baseUrl: string;
    private authToken: string | null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.authToken = localStorage.getItem('authToken'); // Fetch token from local storage
    }

    get(
        endpoint: string,
        params: any = {},
        retry = false,
        cancelToken: any = null,
    ): Promise<AxiosResponse<any> | undefined> {
        return this.request(endpoint, 'get', params, 'json', retry, cancelToken);
    }

    post(
        endpoint: string,
        params: any = {},
        responseType: 'json' | 'blob' = 'json',
        retry = false,
        cancelToken: any = null,
        additionalConfig: AxiosRequestConfig = {},
    ): Promise<AxiosResponse<any> | undefined> {
        return this.request(
            endpoint,
            'post',
            params,
            responseType,
            retry,
            cancelToken,
            additionalConfig,
        );
    }

    private async request(
        endpoint: string,
        method: 'get' | 'post',
        params: any = {},
        responseType: 'json' | 'blob' = 'json',
        retry = false,
        cancelToken: any = null,
        additionalConfig: AxiosRequestConfig = {},
    ): Promise<AxiosResponse<any> | undefined> {
        const maxRetries = retry ? 5 : 1;
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        const authHeader = `Bearer ${this.authToken}`;
        if (additionalConfig.headers) additionalConfig.headers.Authorization = authHeader;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const config: AxiosRequestConfig = {
                    url: `${this.baseUrl}/api/${endpoint}`,
                    method,
                    headers: {
                        Authorization: authHeader,
                    },
                    responseType,
                    cancelToken,
                    ...additionalConfig, // Spread additional config here
                };

                // For GET requests, use `params` as query parameters
                if (method === 'get') {
                    config.params = params;
                } else {
                    // For POST requests, use `params` as the request body
                    config.data = params;
                }

                // Make the API request
                const response = await axios(config);
                return response;
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                    return undefined;
                }
                console.error(`API call failed on attempt ${attempt + 1}:`, error);
                if (attempt < maxRetries - 1) {
                    await delay(3000); // Delay before retrying
                } else {
                    throw error;
                }
            }
        }
        return undefined;
    }
}

export default new ApiClient(ipAddress);
