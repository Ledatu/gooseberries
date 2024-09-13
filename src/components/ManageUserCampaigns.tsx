import React, {useEffect, useState} from 'react';
import {useUser} from './RequireAuth';
import {TextInput, Text, Button, Card, Icon, Link} from '@gravity-ui/uikit';
import {Pencil} from '@gravity-ui/icons';
import {Identity} from '@gravity-ui/illustrations';
import {AddMemberModal} from './AddMemberModal';
import {ManageUserModal} from './ManageUserModal';
import {ChangeApiModal} from './ChangeApiModal';

const MemberInfo = ({_id, firstName, lastName, username, photoUrl, sellerId, modules}) => {
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
                <Link target="_blank" href={`t.me/${username}`} view="primary">
                    @{username}
                </Link>
            </div>
            <ManageUserModal sellerId={sellerId} memberInfo={{_id}} modules={modules}>
                <Button view="flat" style={{margin: '0 4px'}} pin="circle-circle">
                    <Icon data={Pencil} />
                </Button>
            </ManageUserModal>
        </Card>
    );
};

const CampaignInfo = ({sellerId, name, ownerId, members, addedMember, setAddedMember}) => {
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
                modules={member?.modules}
            />,
        );
        membersInfo.push(<div style={{minWidth: 8}} />);
    }
    membersInfo.pop();

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <TextInput disabled value={name} size="l" />
                <div style={{minWidth: 8}} />
                <ChangeApiModal sellerId={sellerId}>
                    <Button view="outlined" size="l">
                        <Text variant="subheader-1">Изменить API ключ</Text>
                    </Button>
                </ChangeApiModal>
                <div style={{minWidth: 8}} />
                <AddMemberModal
                    sellerId={sellerId}
                    addedMember={addedMember}
                    setAddedMember={setAddedMember}
                >
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
    const [addedMember, setAddedMember] = useState({} as any);

    useEffect(() => {
        console.log(user, campaigns);

        const campaignsInfosTemp = [] as any[];
        if (campaigns && campaigns.length)
            for (const campaign of campaigns) {
                console.log(campaign, campaign?.seller_id);

                const {isOwner} = campaign ?? {};
                if (!isOwner) continue;
                campaignsInfosTemp.push(
                    <CampaignInfo
                        sellerId={campaign?.seller_id}
                        name={campaign?.name}
                        ownerId={campaign?.owner_id}
                        members={campaign?.members}
                        addedMember={addedMember}
                        setAddedMember={setAddedMember}
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
            {!campaignsInfos || !campaignsInfos.length ? <Identity /> : <></>}
            {campaignsInfos}
        </div>
    );
};
