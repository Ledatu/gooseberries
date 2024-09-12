import React, {useEffect, useState} from 'react';
import {useUser} from './RequireAuth';
import {TextInput, Text, Button, Card, Icon} from '@gravity-ui/uikit';
import {Pencil} from '@gravity-ui/icons';
import {Identity} from '@gravity-ui/illustrations';
import {AddMemberModal} from './AddMemberModal';

const MemberInfo = ({_id, firstName, lastName, username, photoUrl, sellerId}) => {
    return (
        <Card
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
            }}
        >
            <img src={photoUrl} style={{height: 36, borderRadius: 100, marginRight: 4}} />
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Text variant="subheader-1">{`${firstName ?? ''} ${lastName ?? ''}`}</Text>
                <Text variant="subheader-1">@{username}</Text>
            </div>
            <Button
                view="flat"
                style={{margin: '0 4px'}}
                pin="circle-circle"
                onClick={() => {
                    console.log(_id, firstName, lastName, username, photoUrl, sellerId);
                }}
            >
                <Icon data={Pencil} />
            </Button>
        </Card>
    );
};

const CampaignInfo = ({sellerId, name, ownerId, members}) => {
    const membersInfo = [] as any[];
    for (const member of members) {
        if (member?.member_id?._id === ownerId) continue;
        membersInfo.push(
            <MemberInfo
                _id={member?.member_id?._id}
                firstName={member?.member_id?.first_name}
                lastName={member?.member_id?.last_name}
                username={member?.member_id?.username}
                photoUrl={member?.member_id?.photo_url}
                sellerId={sellerId}
            />,
        );
        membersInfo.push(<div style={{minWidth: 8}} />);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextInput disabled value={name} size="l" />
                <div style={{minWidth: 8}} />
                <Button view="outlined" size="l">
                    <Text variant="subheader-1">Изменить API ключ</Text>
                </Button>
                <div style={{minWidth: 8}} />
                <AddMemberModal>
                    <Button view="outlined" size="l">
                        <Text variant="subheader-1">Добавить сотрудника</Text>
                    </Button>
                </AddMemberModal>
            </div>
            <div style={{minHeight: 8}} />
            <div style={{display: 'flex', flexDirection: 'row'}}>{membersInfo}</div>
        </div>
    );
};

export const ManageUserCampaigns = () => {
    const {userInfo} = useUser();
    const {user, campaigns} = userInfo ?? {};
    const [campaignsInfos, setCampaignsInfos] = useState([] as any[]);

    useEffect(() => {
        console.log(user, campaigns);

        const campaignsInfosTemp = [] as any[];
        if (campaigns && campaigns.length)
            for (const campaign of campaigns) {
                const {isOwner} = campaign ?? {};
                if (!isOwner) continue;
                campaignsInfosTemp.push(
                    <CampaignInfo
                        sellerId={campaign?.seller_id}
                        name={campaign?.name}
                        ownerId={campaign?.owner_id}
                        members={campaign?.members}
                    />,
                );
                campaignsInfosTemp.push(<div style={{minHeight: 16}} />);
            }
        setCampaignsInfos(campaignsInfosTemp);
    }, [campaigns]);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {!campaigns || !campaigns.length ? <Identity /> : <></>}
            {campaignsInfos}
        </div>
    );
};
