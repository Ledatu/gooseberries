import {Button, Text} from '@gravity-ui/uikit';
import React from 'react';
import {AddApiModal} from 'src/components/AddApiModal';
import {ManageUserCampaigns} from 'src/components/ManageUserCampaigns';

export const ApiPage = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100vw',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ManageUserCampaigns />
            <AddApiModal>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <Button size="l" view="outlined">
                        <Text variant="subheader-1">Добавить новый магазин WB</Text>
                    </Button>
                </div>
            </AddApiModal>
        </div>
    );
};