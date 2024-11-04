import React from 'react';
import {ManageUserCampaigns} from 'src/components/ManageUserCampaigns';

export const ApiPage = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: 'calc(100vh - 100px)',
                alignItems: 'center',
            }}
        >
            <ManageUserCampaigns />
        </div>
    );
};
