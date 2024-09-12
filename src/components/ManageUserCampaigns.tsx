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

const CampaignInfo = ({sellerId, name, ownerId, memberDetails}) => {
    const members = [] as any[];
    for (const member of memberDetails) {
        const {_id} = member;
        if (_id === ownerId) continue;
        members.push(
            <MemberInfo
                _id={_id}
                firstName={member?.first_name}
                lastName={member?.last_name}
                username={member?.username}
                photoUrl={member?.photo_url}
                sellerId={sellerId}
            />,
        );
        members.push(<div style={{minWidth: 8}} />);
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
            <div style={{display: 'flex', flexDirection: 'row'}}>{members}</div>
        </div>
    );
};

export const ManageUserCampaigns = () => {
    const {userInfo} = useUser();
    const {user} = userInfo ?? {};
    const {campaigns} = user ?? ([] as any[]);
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
                        memberDetails={campaign?.memberDetails}
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
