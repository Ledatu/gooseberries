'use client';

import {Alert} from '@gravity-ui/uikit';
import {useError} from '@/contexts/ErrorContext';

export const GlobalAlert = () => {
    const {error} = useError();

    if (!error) return null;

    return (
        <Alert
            style={{position: 'absolute', top: 100, right: 50}}
            theme="danger"
            className="global-alert"
            message={error}
        />
    );
};
