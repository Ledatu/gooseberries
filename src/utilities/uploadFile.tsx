import ApiClient from './ApiClient';
import {AxiosProgressEvent} from 'axios';

export const uploadFile = async (
    file: File,
    params: Record<string, unknown>, // Additional parameters
    endpoint: string,
) => {
    if (!file) {
        throw new Error('No file selected');
    }

    const formData = new FormData();
    formData.append('file', file);

    // Append additional parameters to FormData
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string' || value instanceof Blob) {
            formData.append(key, value);
        } else {
            formData.append(key, JSON.stringify(value)); // Convert other types to string
        }
    }

    try {
        const response = await ApiClient.post(
            endpoint,
            formData, // Use FormData as params
            'json', // Expected response type
            false, // Retry not needed here
            null, // No cancel token
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1), // Ensure total is not undefined
                    );
                    console.log(`Upload Progress: ${percentCompleted}%`);
                },
            },
        );

        console.log('File uploaded successfully:', response?.data);
        return response?.data; // Return response for further processing
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Re-throw for caller to handle
    }
};
