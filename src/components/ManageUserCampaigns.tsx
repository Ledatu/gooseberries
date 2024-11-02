import React, {useEffect, useState} from 'react';
import {useUser} from './RequireAuth';
import {Text, Button, Card, Icon, Link, TextInput} from '@gravity-ui/uikit';
import {Pencil, Magnifier} from '@gravity-ui/icons';
import {Identity} from '@gravity-ui/illustrations';
import {AddMemberModal} from './AddMemberModal';
import {ManageUserModal} from './ManageUserModal';
import {ChangeApiModal} from './ChangeApiModal';

const EditMemberInfo = ({_id, firstName, lastName, username, photoUrl, sellerId, modules}) => {
    return (
        <Card
            style={{
                height: 38,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
            }}
        >
            <UserInfo
                firstName={firstName}
                lastName={lastName}
                username={username}
                photoUrl={photoUrl}
                view={'clear'}
            />
            <ManageUserModal sellerId={sellerId} memberInfo={{_id}} modules={modules}>
                <Button view="flat" style={{margin: '0 4px'}} pin="circle-circle">
                    <Icon data={Pencil} />
                </Button>
            </ManageUserModal>
        </Card>
    );
};

const UserInfo = ({firstName, lastName, username, photoUrl, view}) => {
    return (
        <Card
            view={view}
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
            }}
        >
            <img src={photoUrl} style={{height: 36, borderRadius: 100, marginRight: 4}} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginRight: view == 'outlined' ? 18 : 0,
                }}
            >
                <Text variant="subheader-1">{`${firstName ?? ''} ${lastName ?? ''}`}</Text>
                <Link target="_blank" href={`https://t.me/${username}`} view="secondary">
                    @{username}
                </Link>
            </div>
        </Card>
    );
};

const cardStyle = {
    boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
    height: 400,
    width: '90vw',
    maxWidth: 900,
    borderRadius: 30,
};

const CampaignInfo = ({
    sellerId,
    subscriptionExpDate,
    name,
    ownerDetails,
    members,
    addedMember,
    setAddedMember,
}) => {
    const membersInfo = [] as any[];
    for (const member of members) {
        if (member?.member_id?._id === ownerDetails?._id) continue;
        membersInfo.push(
            <EditMemberInfo
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
        <Card
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 32,
                padding: 30,
                ...cardStyle,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 30,
                    backdropFilter: 'blur(200px)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            rowGap: 8,
                        }}
                    >
                        <div
                            style={{
                                minWidth: 200,
                                maxWidth: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                rowGap: 8,
                            }}
                        >
                            <Text style={{marginRight: 16}} variant="header-2">
                                {name}
                            </Text>
                            <ChangeApiModal sellerId={sellerId}>
                                <Button view="outlined" pin="circle-circle" size="l">
                                    <Icon data={Pencil} />
                                    <Text variant="subheader-1">Изменить API ключ</Text>
                                </Button>
                            </ChangeApiModal>
                        </div>
                        <UserInfo
                            firstName={ownerDetails?.first_name}
                            lastName={ownerDetails?.last_name}
                            username={ownerDetails?.username}
                            photoUrl={ownerDetails?.photo_url}
                            view={'clear'}
                        />
                    </div>
                    <div style={{minHeight: 8}} />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            rowGap: 8,
                        }}
                    >
                        <Text style={{marginRight: 16}} variant="header-1">
                            Сотрудники
                        </Text>
                        <AddMemberModal
                            sellerId={sellerId}
                            addedMember={addedMember}
                            setAddedMember={setAddedMember}
                        >
                            <Button view="outlined" pin="circle-circle" size="l">
                                <Text variant="subheader-1">Добавить</Text>
                            </Button>
                        </AddMemberModal>
                    </div>
                </div>
                <div style={{minHeight: 16}} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        rowGap: 8,
                        maxHeight: 'calc(100%  - 116px - 40px)',
                        overflow: 'auto',
                    }}
                >
                    {membersInfo}
                </div>
            </div>
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    height: 45,
                    width: cardStyle.width,
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Text
                    style={{marginLeft: 30, marginTop: 16}}
                    variant="body-3"
                    color={
                        new Date(subscriptionExpDate).getTime() - new Date().getTime() <
                        86400 * 7 * 1000
                            ? 'danger'
                            : 'secondary'
                    }
                >
                    {subscriptionExpDate && subscriptionExpDate !== '2100-01-01T00:00:00.000Z'
                        ? `Подписка до ${new Date(subscriptionExpDate).toLocaleDateString('ru-RU')}`
                        : 'Бессрочная подписка'}
                </Text>
            </div>
        </Card>
    );
};

export const ManageUserCampaigns = () => {
    const {userInfo} = useUser();
    const {campaigns} = userInfo ?? {};
    const [campaignsInfos, setCampaignsInfos] = useState([] as any[]);
    const [addedMember, setAddedMember] = useState({} as any);
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        const campaignsInfosTemp = [] as any[];
        const sortedCampaigns = campaigns
            .sort((a, b) => a?.ownerDetails?._id - b?.ownerDetails?._id)
            .sort(
                (a, b) =>
                    new Date(b?.subscriptionUntil)?.getTime() -
                    new Date(a?.subscriptionUntil)?.getTime(),
            );
        if (campaigns && campaigns.length)
            for (const campaign of sortedCampaigns) {
                const {name, isOwner} = campaign ?? {};
                if (!isOwner) continue;

                if (filterValue != '') {
                    if (!name?.toLocaleLowerCase()?.includes(filterValue.toLocaleLowerCase())) {
                        const details = {...campaign?.ownerDetails};
                        delete details['photo_url'];
                        const vals = Object.values(details ?? {})?.join('');
                        console.log(vals);

                        if (!vals?.toLocaleLowerCase()?.includes(filterValue.toLocaleLowerCase()))
                            continue;
                    }
                }
                campaignsInfosTemp.push(
                    <CampaignInfo
                        subscriptionExpDate={campaign?.subscriptionUntil}
                        sellerId={campaign?.seller_id}
                        name={campaign?.name}
                        ownerDetails={campaign?.ownerDetails}
                        members={campaign?.members}
                        addedMember={addedMember}
                        setAddedMember={setAddedMember}
                    />,
                );
            }
        setCampaignsInfos(campaignsInfosTemp);
    }, [campaigns, filterValue]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            {!campaignsInfos || !campaignsInfos.length ? <Identity /> : <></>}
            {campaignsInfos ? (
                <Card
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        overflow: 'hidden',
                        alignItems: 'center',
                        width: '70vw',
                        maxWidth: 700,
                        backdropFilter: 'blur(20px)',
                        position: 'fixed',
                        top: 100,
                        zIndex: 100,
                        borderRadius: 30,
                        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                    }}
                >
                    <TextInput
                        leftContent={
                            <div
                                style={{
                                    marginRight: 8,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon data={Magnifier} />
                            </div>
                        }
                        style={{marginLeft: 12}}
                        view="clear"
                        value={filterValue}
                        onUpdate={(val) => setFilterValue(val)}
                        placeholder="Имя магазина или владелец"
                        size="xl"
                        hasClear
                    />
                </Card>
            ) : (
                <></>
            )}
            <div style={{marginTop: 100}}>{campaignsInfos}</div>
        </div>
    );
};
