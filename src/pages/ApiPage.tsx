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
                width: '100%',
                height: 'calc(100vh - 100px)',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ManageUserCampaigns />
            <AddApiModal>
                <div
                    style={{
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
